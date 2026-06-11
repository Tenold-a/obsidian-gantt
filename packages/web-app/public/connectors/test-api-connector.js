// Test API Connector for Obsidian Gantt Chart
// Fetches data from a local test server (or any compatible API).
//
// Configuration (ctx.config):
//   baseUrl: string (required) — base URL of the API server, e.g. "http://localhost:3456"
//
// Supported API shapes:
//   GET  /api/data             → { tasks, persons, projects }
//   GET  /api/tasks            → Task[]
//   GET  /api/persons          → Person[]
//   GET  /api/projects         → Project[]
//   POST /api/tasks            ← batch upsert (JSON array)
//   POST /api/projects         ← batch upsert (JSON array)
//   DELETE /api/tasks/:id      ← delete a task
//   DELETE /api/projects/:id   ← delete a project

async function fetch(ctx) {
  const baseUrl = (ctx.config.baseUrl || 'http://localhost:3456').replace(/\/+$/, '');

  ctx.log(`Fetching from ${baseUrl}/api/data`);

  // Try the bulk endpoint first
  const response = await ctx.request(`${baseUrl}/api/data`);

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  const rawData = await response.json();
  return rawData;
}

function transform(rawData, ctx) {
  const data = rawData || {};

  // Map tasks — expect { id, title, startDate?, endDate?, progress?, personId?, projectId? }
  const tasks = (data.tasks || []).map(function (t) {
    var task = {
      id: String(t.id),
      title: t.title || 'Untitled',
    };
    if (t.startDate) task.startDate = t.startDate;
    if (t.endDate) task.endDate = t.endDate;
    if (t.progress !== undefined && t.progress !== null) {
      task.progress = Math.max(0, Math.min(1, Number(t.progress)));
    }
    if (t.personId) task.personId = String(t.personId);
    if (t.projectId) task.projectId = String(t.projectId);
    if (t.status) task.status = t.status;
    if (t.dependencies) task.dependencies = t.dependencies;
    if (t.tags) task.tags = t.tags;
    if (t.url) task.url = t.url;
    return task;
  });

  // Map persons — expect { id, name, position? }
  const persons = (data.persons || []).map(function (p) {
    var person = {
      id: String(p.id),
      name: p.name || p.id,
    };
    if (p.position) person.position = p.position;
    if (p.avatar) person.avatar = p.avatar;
    return person;
  });

  // Map projects — expect { id, name, color?, status?, description?, requester? }
  const projects = (data.projects || []).map(function (pr) {
    var project = {
      id: String(pr.id),
      name: pr.name || pr.id,
    };
    if (pr.color) project.color = pr.color;
    if (pr.status) project.status = pr.status;
    if (pr.description) project.description = pr.description;
    if (pr.requester) project.requester = pr.requester;
    if (pr.keyDates) project.keyDates = pr.keyDates;
    if (pr.keyLinks) project.keyLinks = pr.keyLinks;
    if (pr.tags) project.tags = pr.tags;
    return project;
  });

  return {
    tasks: tasks,
    persons: persons,
    projects: projects,
  };
}

/**
 * Push local changes back to the API server.
 * payload.tasks / payload.projects → POST to batch upsert
 * payload.deletedTaskIds / payload.deletedProjectIds → DELETE each
 *
 * @param {object} payload - PushChangesPayload
 * @param {object} ctx - ConnectorContext
 * @param {function} [onProgress] - Optional progress callback
 */
async function push(payload, ctx, onProgress) {
  var baseUrl = (ctx.config.baseUrl || 'http://localhost:3456').replace(/\/+$/, '');
  var failedItems = [];

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
    // Upsert tasks
    if (payload.tasks && payload.tasks.length > 0) {
      for (var i = 0; i < payload.tasks.length; i++) {
        var task = payload.tasks[i];
        report('Pushing task: ' + (task.title || task.id));
        try {
          var taskRes = await ctx.request(baseUrl + '/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          var projRes = await ctx.request(baseUrl + '/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
          var delRes = await ctx.request(baseUrl + '/api/tasks/' + encodeURIComponent(tid), {
            method: 'DELETE',
          });
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
          var delProjRes = await ctx.request(baseUrl + '/api/projects/' + encodeURIComponent(pid), {
            method: 'DELETE',
          });
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

/**
 * Fetch rich detail for a single project or task.
 * GET /api/tasks/:id  → TaskDetail (with description)
 * GET /api/projects/:id → ProjectDetail (with keyDates, keyLinks, description)
 */
async function fetchDetail(id, type, ctx) {
  var baseUrl = (ctx.config.baseUrl || 'http://localhost:3456').replace(/\/+$/, '');
  var endpoint = baseUrl + '/api/' + (type === 'task' ? 'tasks/' : 'projects/') + encodeURIComponent(id);

  ctx.log('Fetching ' + type + ' detail: ' + endpoint);

  var response = await ctx.request(endpoint);

  if (!response.ok) {
    throw new Error('API returned status ' + response.status + ' for ' + type + ' detail: ' + id);
  }

  return response.json();
}

function transformDetail(rawData, _ctx) {
  var data = rawData || {};

  // TaskDetail: has "title" field
  if (data.title !== undefined) {
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
    if (data.description) taskDetail.description = data.description;
    if (data.metadata) taskDetail.metadata = data.metadata;
    return taskDetail;
  }

  // ProjectDetail
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

module.exports = { fetch: fetch, transform: transform, push: push, fetchDetail: fetchDetail, transformDetail: transformDetail };
