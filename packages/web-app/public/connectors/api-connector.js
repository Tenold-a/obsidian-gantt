// API Connector for Obsidian Gantt Chart
// Fetches Gantt rendering data and on-demand detail from a REST API.
//
// Two-interface design:
//   Interface 1 — fetch() / transform() → CanonicalData (lightweight list data)
//   Interface 2 — fetchDetail() / transformDetail() → ProjectDetail | TaskDetail
//
// Configuration (ctx.config):
//   baseUrl: string (required) — base URL of the API server, e.g. "http://localhost:3456"
//   token: string (optional) — Bearer token for Authorization header
//
// Supported API endpoints:
//
//   Rendering data (lightweight, for initial chart render):
//     GET  /api/data              → { tasks, persons, projects }
//
//   Detail data (rich, fetched when user clicks a task/project):
//     GET  /api/tasks/:id         → TaskDetail (with description, metadata)
//     GET  /api/projects/:id      → ProjectDetail (with description, keyDates, keyLinks)
//
//   Push (optional, for bidirectional sync):
//     POST   /api/tasks           ← [Task...]  batch upsert
//     POST   /api/projects        ← [Project...] batch upsert
//     DELETE /api/tasks/:id       ← delete single task
//     DELETE /api/projects/:id    ← delete single project

// ── helpers ──

function getBaseUrl(ctx) {
  return (ctx.config.baseUrl || 'http://localhost:3456').replace(/\/+$/, '');
}

function authHeaders(ctx) {
  var headers = { 'Content-Type': 'application/json' };
  if (ctx.config.token) {
    headers['Authorization'] = 'Bearer ' + ctx.config.token;
  }
  return headers;
}

// ── Interface 1: Rendering Data ──

async function fetch(ctx) {
  var baseUrl = getBaseUrl(ctx);
  ctx.logger.info('Fetching rendering data', { endpoint: baseUrl + '/api/data' });

  var response = await ctx.request(baseUrl + '/api/data', {
    headers: authHeaders(ctx),
  });

  if (!response.ok) {
    ctx.logger.error('Fetch failed', { status: response.status, endpoint: '/api/data' });
    throw new Error('API returned status ' + response.status + ' for /api/data');
  }

  var raw = await response.json();
  ctx.logger.info('Fetch completed', { taskCount: (raw.tasks || []).length, personCount: (raw.persons || []).length, projectCount: (raw.projects || []).length });
  return raw;
}

function transform(rawData, ctx) {
  var data = rawData || {};

  var tasks = (data.tasks || []).map(function (t) {
    var task = {
      id: String(t.id),
      title: t.title || 'Untitled',
    };
    if (t.startDate) task.startDate = t.startDate;
    if (t.endDate) task.endDate = t.endDate;
    if (t.progress !== undefined && t.progress !== null) {
      task.progress = Math.max(0, Math.min(1, Number(t.progress)));
    }
    if (t.status) task.status = t.status;
    if (t.personId) task.personId = String(t.personId);
    if (t.projectId) task.projectId = String(t.projectId);
    if (t.parentId) task.parentId = String(t.parentId);
    if (t.dependencies) task.dependencies = t.dependencies;
    if (t.tags) task.tags = t.tags;
    if (t.url) task.url = t.url;
    if (t.metadata) task.metadata = t.metadata;
    return task;
  });

  var persons = (data.persons || []).map(function (p) {
    var person = { id: String(p.id), name: p.name || p.id };
    if (p.position) person.position = p.position;
    if (p.avatar) person.avatar = p.avatar;
    return person;
  });

  // Projects in rendering data are lightweight: only fields needed for chart display.
  // Fields like description, keyDates, keyLinks are fetched on demand via fetchDetail.
  var projects = (data.projects || []).map(function (pr) {
    var project = {
      id: String(pr.id),
      name: pr.name || pr.id,
    };
    if (pr.color) project.color = pr.color;
    if (pr.status) project.status = pr.status;
    if (pr.tags) project.tags = pr.tags;
    if (pr.metadata) project.metadata = pr.metadata;
    // description, requester, keyDates, keyLinks are NOT included here —
    // they come from the detail endpoint via fetchDetail / transformDetail
    return project;
  });

  return {
    tasks: tasks,
    persons: persons,
    projects: projects,
  };
}

// ── Interface 2: Detail Data ──

/**
 * Fetch rich detail for a single project or task.
 *
 * @param {string} id       — Entity ID
 * @param {'project'|'task'} type — Entity type
 * @param {object} ctx       — ConnectorContext
 * @returns {Promise<object>} Raw detail data from API
 */
async function fetchDetail(id, type, ctx) {
  var baseUrl = getBaseUrl(ctx);
  var endpoint = type === 'task'
    ? baseUrl + '/api/tasks/' + encodeURIComponent(id)
    : baseUrl + '/api/projects/' + encodeURIComponent(id);

  ctx.logger.info('Fetching detail', { type: type, id: id, endpoint: endpoint });

  var response = await ctx.request(endpoint, {
    headers: authHeaders(ctx),
  });

  if (!response.ok) {
    throw new Error('API returned status ' + response.status + ' for ' + type + ' detail: ' + id);
  }

  return response.json();
}

/**
 * Transform raw API detail response into ProjectDetail or TaskDetail.
 *
 * @param {object} rawData — Raw response from detail API
 * @param {object} ctx     — ConnectorContext
 * @returns {ProjectDetail|TaskDetail}
 */
function transformDetail(rawData, ctx) {
  var data = rawData || {};

  // Determine type: TaskDetail has "title", ProjectDetail has "keyDates"/"keyLinks" more commonly
  if (data.title !== undefined && data.keyDates === undefined && data.keyLinks === undefined) {
    // It's a TaskDetail
    var taskDetail = {
      id: String(data.id),
      title: data.title || 'Untitled',
    };
    if (data.startDate) taskDetail.startDate = data.startDate;
    if (data.endDate) taskDetail.endDate = data.endDate;
    if (data.progress !== undefined && data.progress !== null) {
      taskDetail.progress = Math.max(0, Math.min(1, Number(data.progress)));
    }
    if (data.status) taskDetail.status = data.status;
    if (data.personId) taskDetail.personId = String(data.personId);
    if (data.projectId) taskDetail.projectId = String(data.projectId);
    if (data.parentId) taskDetail.parentId = String(data.parentId);
    if (data.dependencies) taskDetail.dependencies = data.dependencies;
    if (data.tags) taskDetail.tags = data.tags;
    if (data.url) taskDetail.url = data.url;
    // Rich fields only available via detail endpoint:
    if (data.description) taskDetail.description = data.description;
    if (data.metadata) taskDetail.metadata = data.metadata;
    return taskDetail;
  }

  // It's a ProjectDetail
  var projectDetail = {
    id: String(data.id),
    name: data.name || data.id,
  };
  if (data.status) projectDetail.status = data.status;
  if (data.color) projectDetail.color = data.color;
  if (data.description) projectDetail.description = data.description;
  if (data.requester) projectDetail.requester = data.requester;
  if (data.keyDates) projectDetail.keyDates = data.keyDates;
  if (data.keyLinks) projectDetail.keyLinks = data.keyLinks;
  if (data.tags) projectDetail.tags = data.tags;
  if (data.metadata) projectDetail.metadata = data.metadata;
  return projectDetail;
}

// ── Optional: Push ──

async function push(payload, ctx, onProgress) {
  var baseUrl = getBaseUrl(ctx);
  var headers = authHeaders(ctx);
  var failedItems = [];

  var pushDelay = parseInt(ctx.config.pushDelay, 10);
  var failEvery = parseInt(ctx.config.failEvery, 10);
  var queryParts = [];
  if (pushDelay > 0) queryParts.push('delay=' + pushDelay);
  if (failEvery > 0) queryParts.push('failEvery=' + failEvery);
  var pushQuery = queryParts.length > 0 ? '?' + queryParts.join('&') : '';

  var totalOps =
    (payload.tasks ? payload.tasks.length : 0) +
    (payload.projects ? payload.projects.length : 0) +
    (payload.deletedTaskIds ? payload.deletedTaskIds.length : 0) +
    (payload.deletedProjectIds ? payload.deletedProjectIds.length : 0);
  var completed = 0;

  function report(msg) {
    if (onProgress) {
      onProgress({ current: completed, total: totalOps, message: msg });
    }
  }

  try {
    // Upsert tasks one at a time for per-item error tracking
    if (payload.tasks && payload.tasks.length > 0) {
      for (var i = 0; i < payload.tasks.length; i++) {
        var task = payload.tasks[i];
        report('Pushing task: ' + (task.title || task.id));
        try {
          var taskRes = await ctx.request(baseUrl + '/api/tasks' + pushQuery, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify([task]),
          });
          if (!taskRes.ok) {
            failedItems.push({ id: task.id, type: 'task', error: 'HTTP ' + taskRes.status });
          }
        } catch (e) {
          failedItems.push({ id: task.id, type: 'task', error: e.message || String(e) });
        }
        completed++;
        report('Pushed task: ' + (task.title || task.id));
      }
    }

    // Upsert projects
    if (payload.projects && payload.projects.length > 0) {
      for (var j = 0; j < payload.projects.length; j++) {
        var proj = payload.projects[j];
        report('Pushing project: ' + (proj.name || proj.id));
        try {
          var projRes = await ctx.request(baseUrl + '/api/projects' + pushQuery, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify([proj]),
          });
          if (!projRes.ok) {
            failedItems.push({ id: proj.id, type: 'project', error: 'HTTP ' + projRes.status });
          }
        } catch (e) {
          failedItems.push({ id: proj.id, type: 'project', error: e.message || String(e) });
        }
        completed++;
        report('Pushed project: ' + (proj.name || proj.id));
      }
    }

    // Delete tasks
    if (payload.deletedTaskIds && payload.deletedTaskIds.length > 0) {
      for (var k = 0; k < payload.deletedTaskIds.length; k++) {
        var tid = payload.deletedTaskIds[k];
        report('Deleting task: ' + tid);
        try {
          var delRes = await ctx.request(
            baseUrl + '/api/tasks/' + encodeURIComponent(tid) + pushQuery,
            { method: 'DELETE', headers: headers }
          );
          if (!delRes.ok) {
            failedItems.push({ id: tid, type: 'task', error: 'HTTP ' + delRes.status });
          }
        } catch (e) {
          failedItems.push({ id: tid, type: 'task', error: e.message || String(e) });
        }
        completed++;
        report('Deleted task: ' + tid);
      }
    }

    // Delete projects
    if (payload.deletedProjectIds && payload.deletedProjectIds.length > 0) {
      for (var m = 0; m < payload.deletedProjectIds.length; m++) {
        var pid = payload.deletedProjectIds[m];
        report('Deleting project: ' + pid);
        try {
          var delProjRes = await ctx.request(
            baseUrl + '/api/projects/' + encodeURIComponent(pid) + pushQuery,
            { method: 'DELETE', headers: headers }
          );
          if (!delProjRes.ok) {
            failedItems.push({ id: pid, type: 'project', error: 'HTTP ' + delProjRes.status });
          }
        } catch (e) {
          failedItems.push({ id: pid, type: 'project', error: e.message || String(e) });
        }
        completed++;
        report('Deleted project: ' + pid);
      }
    }

    if (failedItems.length > 0) {
      return {
        success: false,
        error: 'Partial failure: ' + failedItems.length + ' of ' + totalOps + ' items failed',
        failedItems: failedItems,
      };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

module.exports = {
  fetch: fetch,
  transform: transform,
  fetchDetail: fetchDetail,
  transformDetail: transformDetail,
  push: push,
};
