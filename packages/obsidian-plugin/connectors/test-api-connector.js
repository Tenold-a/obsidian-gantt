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
 */
async function push(payload, ctx) {
  var baseUrl = (ctx.config.baseUrl || 'http://localhost:3456').replace(/\/+$/, '');

  try {
    // Upsert tasks
    if (payload.tasks && payload.tasks.length > 0) {
      ctx.log('Pushing ' + payload.tasks.length + ' tasks to API');
      var taskRes = await ctx.request(baseUrl + '/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.tasks),
      });
      if (!taskRes.ok) {
        return { success: false, error: 'Failed to push tasks: HTTP ' + taskRes.status };
      }
    }

    // Upsert projects
    if (payload.projects && payload.projects.length > 0) {
      ctx.log('Pushing ' + payload.projects.length + ' projects to API');
      var projRes = await ctx.request(baseUrl + '/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.projects),
      });
      if (!projRes.ok) {
        return { success: false, error: 'Failed to push projects: HTTP ' + projRes.status };
      }
    }

    // Delete tasks
    if (payload.deletedTaskIds && payload.deletedTaskIds.length > 0) {
      ctx.log('Deleting ' + payload.deletedTaskIds.length + ' tasks from API');
      for (var i = 0; i < payload.deletedTaskIds.length; i++) {
        var delRes = await ctx.request(baseUrl + '/api/tasks/' + encodeURIComponent(payload.deletedTaskIds[i]), {
          method: 'DELETE',
        });
        if (!delRes.ok) {
          return { success: false, error: 'Failed to delete task ' + payload.deletedTaskIds[i] + ': HTTP ' + delRes.status };
        }
      }
    }

    // Delete projects
    if (payload.deletedProjectIds && payload.deletedProjectIds.length > 0) {
      ctx.log('Deleting ' + payload.deletedProjectIds.length + ' projects from API');
      for (var j = 0; j < payload.deletedProjectIds.length; j++) {
        var delProjRes = await ctx.request(baseUrl + '/api/projects/' + encodeURIComponent(payload.deletedProjectIds[j]), {
          method: 'DELETE',
        });
        if (!delProjRes.ok) {
          return { success: false, error: 'Failed to delete project ' + payload.deletedProjectIds[j] + ': HTTP ' + delProjRes.status };
        }
      }
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

module.exports = { fetch: fetch, transform: transform, push: push };
