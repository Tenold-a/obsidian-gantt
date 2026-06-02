// Simple local test server for Gantt chart external API connector testing.
// No dependencies — uses only Node.js built-in http module.
// Run: node test-server/server.mjs
// Default port: 3456 (set PORT env var to override)

import http from 'node:http';

const PORT = parseInt(process.env.PORT || '3456', 10);

// ── Test data ────────────────────────────────────────────────────────

// 14 persons across different roles
const persons = [
  { id: 'p001', name: 'Zhang Wei', position: 'Senior Backend Engineer' },
  { id: 'p002', name: 'Li Na', position: 'UI Designer' },
  { id: 'p003', name: 'Wang Fang', position: 'Engineering Manager' },
  { id: 'p004', name: 'Chen Jie', position: 'Frontend Developer' },
  { id: 'p005', name: 'Liu Yang', position: 'DevOps Engineer' },
  { id: 'p006', name: 'Huang Li', position: 'QA Lead' },
  { id: 'p007', name: 'Zhao Min', position: 'Product Manager' },
  { id: 'p008', name: 'Sun Hao', position: 'Backend Developer' },
  { id: 'p009', name: 'Wu Jing', position: 'Data Engineer' },
  { id: 'p010', name: 'Xu Mei', position: 'Technical Writer' },
  { id: 'p011', name: 'Ma Ke', position: 'Mobile Developer' },
  { id: 'p012', name: 'Lin Feng', position: 'Security Engineer' },
  { id: 'p013', name: 'Zhou Lei', position: 'Data Scientist' },
  { id: 'p014', name: 'Tang Rui', position: 'UX Researcher' },
];

// 10 projects with varied statuses
const projects = [
  { id: 'proj-crm', name: 'CRM Platform', color: '#4A90D9', status: 'in-progress', requester: 'Sales Dept' },
  { id: 'proj-mobile', name: 'Mobile Banking App', color: '#7B61F8', status: 'in-progress', requester: 'Retail Banking' },
  { id: 'proj-data', name: 'Data Lake Migration', color: '#98C379', status: 'pending', requester: 'Data Platform' },
  { id: 'proj-qa', name: 'QA Automation', color: '#E06C75', status: 'online', requester: 'Engineering' },
  { id: 'proj-portal', name: 'Customer Portal v2', color: '#E5C07B', status: 'in-progress', requester: 'Product' },
  { id: 'proj-infra', name: 'Infrastructure Upgrade', color: '#56B6C2', status: 'pending', requester: 'SRE Team' },
  { id: 'proj-analytics', name: 'Real-time Analytics', color: '#C678DD', status: 'in-progress', requester: 'BI Team' },
  { id: 'proj-auth', name: 'SSO & Auth Service', color: '#BE5046', status: 'online', requester: 'Security' },
  { id: 'proj-notify', name: 'Notification Center', color: '#61AFEF', status: 'pending', requester: 'Product' },
  { id: 'proj-search', name: 'Full-Text Search', color: '#D19A66', status: 'completed', requester: 'All Teams' },
];

// 55 tasks spread across projects and persons
const tasks = [
  // ── CRM Platform ──
  { id: 't001', title: 'Requirements gathering', startDate: '2026-05-04', endDate: '2026-05-15', progress: 1, personId: 'p007', projectId: 'proj-crm', tags: ['planning'] },
  { id: 't002', title: 'Database schema design', startDate: '2026-05-18', endDate: '2026-05-25', progress: 1, personId: 'p001', projectId: 'proj-crm', tags: ['backend'] },
  { id: 't003', title: 'REST API scaffolding', startDate: '2026-05-25', endDate: '2026-06-03', progress: 0.9, personId: 'p001', projectId: 'proj-crm', tags: ['backend'] },
  { id: 't004', title: 'Contact management module', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.6, personId: 'p008', projectId: 'proj-crm', tags: ['backend'], dependencies: ['t003'] },
  { id: 't005', title: 'Lead tracking dashboard', startDate: '2026-06-08', endDate: '2026-06-22', progress: 0.2, personId: 'p004', projectId: 'proj-crm', tags: ['frontend'] },
  { id: 't006', title: 'CRM UI components library', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.8, personId: 'p002', projectId: 'proj-crm', tags: ['design'] },

  // ── Mobile Banking App ──
  { id: 't007', title: 'App architecture design', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p011', projectId: 'proj-mobile', tags: ['planning'] },
  { id: 't008', title: 'Login & biometric auth', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.9, personId: 'p011', projectId: 'proj-mobile', tags: ['frontend'], dependencies: ['t007'] },
  { id: 't009', title: 'Account overview screen', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p004', projectId: 'proj-mobile', tags: ['frontend'] },
  { id: 't010', title: 'Transaction history list', startDate: '2026-06-10', endDate: '2026-06-20', progress: 0, personId: 'p004', projectId: 'proj-mobile', tags: ['frontend'], dependencies: ['t009'] },
  { id: 't011', title: 'Payment flow API', startDate: '2026-05-25', endDate: '2026-06-08', progress: 0.7, personId: 'p001', projectId: 'proj-mobile', tags: ['backend'] },
  { id: 't012', title: 'Push notification integration', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0.1, personId: 'p011', projectId: 'proj-mobile', tags: ['frontend'] },

  // ── Data Lake Migration ──
  { id: 't013', title: 'Inventory existing data sources', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.4, personId: 'p009', projectId: 'proj-data', tags: ['planning'] },
  { id: 't014', title: 'Schema mapping document', startDate: '2026-06-08', endDate: '2026-06-15', progress: 0, personId: 'p013', projectId: 'proj-data', tags: ['planning'], dependencies: ['t013'] },
  { id: 't015', title: 'ETL pipeline design', startDate: '2026-06-15', endDate: '2026-06-30', progress: 0, personId: 'p009', projectId: 'proj-data', tags: ['backend'], dependencies: ['t014'] },
  { id: 't016', title: 'Data quality validation framework', startDate: '2026-06-20', endDate: '2026-07-05', progress: 0, personId: 'p013', projectId: 'proj-data', tags: ['backend'] },

  // ── QA Automation ──
  { id: 't017', title: 'Test framework evaluation', startDate: '2026-05-04', endDate: '2026-05-10', progress: 1, personId: 'p006', projectId: 'proj-qa', tags: ['planning'] },
  { id: 't018', title: 'CI/CD test integration', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p005', projectId: 'proj-qa', tags: ['devops'] },
  { id: 't019', title: 'API test suite', startDate: '2026-05-25', endDate: '2026-06-10', progress: 0.7, personId: 'p006', projectId: 'proj-qa', tags: ['backend'], dependencies: ['t018'] },
  { id: 't020', title: 'UI automation scripts', startDate: '2026-06-01', endDate: '2026-06-15', progress: 0.3, personId: 'p006', projectId: 'proj-qa', tags: ['frontend'] },
  { id: 't021', title: 'Performance test suite', startDate: '2026-06-10', endDate: '2026-06-20', progress: 0, personId: 'p005', projectId: 'proj-qa', tags: ['devops'] },
  { id: 't022', title: 'Security scan pipeline', startDate: '2026-06-15', endDate: '2026-06-25', progress: 0, personId: 'p012', projectId: 'proj-qa', tags: ['security'] },

  // ── Customer Portal v2 ──
  { id: 't023', title: 'User research interviews', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p014', projectId: 'proj-portal', tags: ['research'] },
  { id: 't024', title: 'Wireframes & prototypes', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.85, personId: 'p002', projectId: 'proj-portal', tags: ['design'] },
  { id: 't025', title: 'Design system tokens', startDate: '2026-05-25', endDate: '2026-06-03', progress: 1, personId: 'p002', projectId: 'proj-portal', tags: ['design'] },
  { id: 't026', title: 'Portal landing page', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.4, personId: 'p004', projectId: 'proj-portal', tags: ['frontend'], dependencies: ['t024'] },
  { id: 't027', title: 'Self-service dashboard', startDate: '2026-06-08', endDate: '2026-06-25', progress: 0.1, personId: 'p004', projectId: 'proj-portal', tags: ['frontend'] },
  { id: 't028', title: 'Knowledge base CMS', startDate: '2026-06-05', endDate: '2026-06-18', progress: 0.2, personId: 'p008', projectId: 'proj-portal', tags: ['backend'] },

  // ── Infrastructure Upgrade ──
  { id: 't029', title: 'Kubernetes cluster setup', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p005', projectId: 'proj-infra', tags: ['devops'] },
  { id: 't030', title: 'Service mesh deployment', startDate: '2026-06-10', endDate: '2026-06-22', progress: 0, personId: 'p005', projectId: 'proj-infra', tags: ['devops'], dependencies: ['t029'] },
  { id: 't031', title: 'Monitoring stack upgrade', startDate: '2026-06-05', endDate: '2026-06-15', progress: 0.3, personId: 'p005', projectId: 'proj-infra', tags: ['devops'] },
  { id: 't032', title: 'Database replication config', startDate: '2026-06-15', endDate: '2026-06-28', progress: 0, personId: 'p001', projectId: 'proj-infra', tags: ['backend'], dependencies: ['t029'] },
  { id: 't033', title: 'Disaster recovery drill', startDate: '2026-06-25', endDate: '2026-07-02', progress: 0, personId: 'p012', projectId: 'proj-infra', tags: ['security'] },

  // ── Real-time Analytics ──
  { id: 't034', title: 'Stream processing architecture', startDate: '2026-05-18', endDate: '2026-05-30', progress: 0.9, personId: 'p009', projectId: 'proj-analytics', tags: ['planning'] },
  { id: 't035', title: 'Kafka topic design', startDate: '2026-06-01', endDate: '2026-06-08', progress: 0.5, personId: 'p009', projectId: 'proj-analytics', tags: ['backend'], dependencies: ['t034'] },
  { id: 't036', title: 'Real-time dashboard POC', startDate: '2026-06-05', endDate: '2026-06-18', progress: 0.2, personId: 'p013', projectId: 'proj-analytics', tags: ['frontend'] },
  { id: 't037', title: 'Data aggregation service', startDate: '2026-06-10', endDate: '2026-06-22', progress: 0, personId: 'p008', projectId: 'proj-analytics', tags: ['backend'], dependencies: ['t035'] },
  { id: 't038', title: 'Alerting rules engine', startDate: '2026-06-15', endDate: '2026-06-25', progress: 0, personId: 'p013', projectId: 'proj-analytics', tags: ['backend'] },
  { id: 't039', title: 'Data export APIs', startDate: '2026-06-20', endDate: '2026-07-01', progress: 0, personId: 'p008', projectId: 'proj-analytics', tags: ['backend'] },

  // ── SSO & Auth Service ──
  { id: 't040', title: 'OAuth2/OIDC flow design', startDate: '2026-05-04', endDate: '2026-05-12', progress: 1, personId: 'p012', projectId: 'proj-auth', tags: ['planning'] },
  { id: 't041', title: 'Token service implementation', startDate: '2026-05-13', endDate: '2026-05-25', progress: 1, personId: 'p001', projectId: 'proj-auth', tags: ['backend'] },
  { id: 't042', title: 'SAML integration', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.8, personId: 'p012', projectId: 'proj-auth', tags: ['backend'], dependencies: ['t041'] },
  { id: 't043', title: 'Role-based access control', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.4, personId: 'p008', projectId: 'proj-auth', tags: ['backend'], dependencies: ['t041'] },
  { id: 't044', title: 'MFA setup & docs', startDate: '2026-06-10', endDate: '2026-06-18', progress: 0, personId: 'p010', projectId: 'proj-auth', tags: ['documentation'] },

  // ── Notification Center ──
  { id: 't045', title: 'Notification system design', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.3, personId: 'p007', projectId: 'proj-notify', tags: ['planning'] },
  { id: 't046', title: 'Email service integration', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0, personId: 'p008', projectId: 'proj-notify', tags: ['backend'] },
  { id: 't047', title: 'In-app notification UI', startDate: '2026-06-12', endDate: '2026-06-25', progress: 0, personId: 'p004', projectId: 'proj-notify', tags: ['frontend'] },
  { id: 't048', title: 'SMS gateway integration', startDate: '2026-06-18', endDate: '2026-06-28', progress: 0, personId: 'p011', projectId: 'proj-notify', tags: ['backend'], dependencies: ['t046'] },
  { id: 't049', title: 'Notification preferences API', startDate: '2026-06-05', endDate: '2026-06-15', progress: 0.1, personId: 'p001', projectId: 'proj-notify', tags: ['backend'] },

  // ── Full-Text Search ──
  { id: 't050', title: 'Search engine evaluation', startDate: '2026-05-01', endDate: '2026-05-08', progress: 1, personId: 'p009', projectId: 'proj-search', tags: ['planning'] },
  { id: 't051', title: 'Elasticsearch cluster setup', startDate: '2026-05-08', endDate: '2026-05-15', progress: 1, personId: 'p005', projectId: 'proj-search', tags: ['devops'] },
  { id: 't052', title: 'Indexing pipeline', startDate: '2026-05-15', endDate: '2026-05-28', progress: 1, personId: 'p009', projectId: 'proj-search', tags: ['backend'], dependencies: ['t051'] },
  { id: 't053', title: 'Search API gateway', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.95, personId: 'p008', projectId: 'proj-search', tags: ['backend'], dependencies: ['t052'] },
  { id: 't054', title: 'Autocomplete service', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p004', projectId: 'proj-search', tags: ['frontend'], dependencies: ['t053'] },
  { id: 't055', title: 'Search analytics dashboard', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0, personId: 'p013', projectId: 'proj-search', tags: ['frontend'] },
];

const data = { persons, projects, tasks };

function sendJSON(res, statusCode, body) {
  const json = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(json);
}

function readBody(req) {
  return new Promise(function (resolve) {
    var chunks = [];
    req.on('data', function (chunk) { chunks.push(chunk); });
    req.on('end', function () {
      var raw = Buffer.concat(chunks).toString('utf8');
      try { resolve(JSON.parse(raw)); }
      catch (_) { resolve(null); }
    });
  });
}

function upsertById(list, items) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item || !item.id) continue;
    var found = -1;
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === item.id) { found = j; break; }
    }
    if (found >= 0) {
      // Merge into existing
      var keys = Object.keys(item);
      for (var k = 0; k < keys.length; k++) {
        list[found][keys[k]] = item[keys[k]];
      }
    } else {
      list.push(item);
    }
  }
}

function deleteById(list, ids) {
  var idSet = {};
  for (var i = 0; i < ids.length; i++) { idSet[ids[i]] = true; }
  for (var j = list.length - 1; j >= 0; j--) {
    if (idSet[list[j].id]) { list.splice(j, 1); }
  }
}

function matchRoute(method, pathname) {
  // DELETE /api/tasks/:id
  var taskDel = pathname.match(/^\/api\/tasks\/(.+)$/);
  if (method === 'DELETE' && taskDel) return { resource: 'tasks', action: 'delete', id: taskDel[1] };
  // DELETE /api/projects/:id
  var projDel = pathname.match(/^\/api\/projects\/(.+)$/);
  if (method === 'DELETE' && projDel) return { resource: 'projects', action: 'delete', id: projDel[1] };
  // POST /api/tasks
  if (method === 'POST' && pathname === '/api/tasks') return { resource: 'tasks', action: 'upsert' };
  // POST /api/projects
  if (method === 'POST' && pathname === '/api/projects') return { resource: 'projects', action: 'upsert' };
  return null;
}

const server = http.createServer(async function (req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // Log request
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${req.method} ${url.pathname}`);

  // ── GET routes ──
  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJSON(res, 200, { ok: true, uptime: process.uptime() });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/tasks') {
    sendJSON(res, 200, data.tasks);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/persons') {
    sendJSON(res, 200, data.persons);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/projects') {
    sendJSON(res, 200, data.projects);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/data') {
    sendJSON(res, 200, data);
    return;
  }

  // ── Write routes (POST / DELETE) ──
  var route = matchRoute(req.method, url.pathname);
  if (route) {
    try {
      if (route.action === 'upsert') {
        var body = await readBody(req);
        if (!body || !Array.isArray(body)) {
          sendJSON(res, 400, { success: false, error: 'Expected a JSON array' });
          return;
        }
        upsertById(data[route.resource], body);
        console.log(`  → upserted ${body.length} ${route.resource}`);
        sendJSON(res, 200, { success: true, count: body.length });
        return;
      }
      if (route.action === 'delete') {
        deleteById(data[route.resource], [route.id]);
        console.log(`  → deleted ${route.resource}/${route.id}`);
        sendJSON(res, 200, { success: true });
        return;
      }
    } catch (e) {
      sendJSON(res, 500, { success: false, error: e.message });
      return;
    }
  }

  sendJSON(res, 404, { error: 'Not found', path: url.pathname });
});

server.listen(PORT, () => {
  console.log(`\nGantt test API server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET    /api/health          — health check`);
  console.log(`  GET    /api/data            — all data at once`);
  console.log(`  GET    /api/tasks           — task list`);
  console.log(`  GET    /api/persons         — person list`);
  console.log(`  GET    /api/projects        — project list`);
  console.log(`  POST   /api/tasks           — batch upsert tasks (JSON array)`);
  console.log(`  POST   /api/projects        — batch upsert projects (JSON array)`);
  console.log(`  DELETE /api/tasks/:id       — delete a task`);
  console.log(`  DELETE /api/projects/:id    — delete a project\n`);
});
