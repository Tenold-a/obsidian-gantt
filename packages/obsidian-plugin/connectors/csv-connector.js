// CSV Connector for Obsidian Gantt Chart
// Reads multiple CSV files (persons, projects, tasks) linked by ID references.
//
// Configuration (ctx.config):
//   paths: object (required) — paths to CSV files relative to vault root
//     paths.persons:  string — path to persons CSV
//     paths.projects: string — path to projects CSV
//     paths.tasks:    string — path to tasks CSV
//   delimiter: string (optional) — CSV delimiter, default ','
//
// CSV file formats (default Chinese column names, configurable via columnMapping):
//
//   persons.csv:
//     id       — Person unique identifier
//     name     — Person display name
//     position — (optional) Job title / role
//
//   projects.csv:
//     id          — Project unique identifier
//     name        — Project display name
//     requesterId — (optional) Person.id of the requester
//     color       — (optional) CSS color for the project bar
//
//   tasks.csv:
//     id        — Task unique identifier
//     title     — Task title
//     startDate — (optional) ISO date YYYY-MM-DD
//     endDate   — (optional) ISO date YYYY-MM-DD
//     progress  — (optional) 0-1 number
//     personId  — (optional) Person.id assigned to this task
//     projectId — (optional) Project.id this task belongs to

var DEFAULT_MAPPING = {
  // persons columns
  personId: 'id',
  personName: 'name',
  personPosition: 'position',
  // projects columns
  projectId: 'id',
  projectName: 'name',
  projectRequesterId: 'requesterId',
  projectColor: 'color',
  // tasks columns
  taskId: 'id',
  taskTitle: 'title',
  taskStartDate: 'startDate',
  taskEndDate: 'endDate',
  taskProgress: 'progress',
  taskPersonId: 'personId',
  taskProjectId: 'projectId',
};

function getMapping(config) {
  var custom = (config && config.columnMapping) || {};
  var result = {};
  var keys = Object.keys(DEFAULT_MAPPING);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    result[k] = custom[k] !== undefined ? custom[k] : DEFAULT_MAPPING[k];
  }
  return result;
}

function readCSV(ctx) {
  return function (path) {
    if (!ctx.readFile) throw new Error('ctx.readFile is not available');
    if (!ctx.parseCSV) throw new Error('ctx.parseCSV is not available');
    var delimiter = ctx.config.delimiter || ',';
    return ctx.readFile(path).then(function (content) {
      return ctx.parseCSV(content, { delimiter: delimiter });
    });
  };
}

/**
 * Read all configured CSV files.
 */
async function fetch(ctx) {
  var paths = ctx.config.paths;
  if (!paths || typeof paths !== 'object') {
    throw new Error('CSV connector requires config.paths: { persons, projects, tasks }');
  }
  if (!paths.persons || !paths.projects || !paths.tasks) {
    throw new Error('config.paths must include: persons, projects, tasks');
  }

  var read = readCSV(ctx);

  var result = {};

  try {
    result.persons = await read(paths.persons);
  } catch (e) {
    throw new Error('Failed to read persons CSV (' + paths.persons + '): ' + e.message);
  }
  try {
    result.projects = await read(paths.projects);
  } catch (e) {
    throw new Error('Failed to read projects CSV (' + paths.projects + '): ' + e.message);
  }
  try {
    result.tasks = await read(paths.tasks);
  } catch (e) {
    throw new Error('Failed to read tasks CSV (' + paths.tasks + '): ' + e.message);
  }

  return result;
}

/**
 * Convert three CSV datasets into CanonicalData.
 *
 * Persons and projects are read first, then tasks reference them by ID.
 * There's no inline deduplication — each CSV is the authoritative source
 * for its entity type.
 */
function transform(rawData, ctx) {
  var mapping = getMapping(ctx.config);

  // ── Column indices from mapping ──
  // persons
  var pId = mapping.personId;
  var pName = mapping.personName;
  var pPos = mapping.personPosition;
  // projects
  var prId = mapping.projectId;
  var prName = mapping.projectName;
  var prReqId = mapping.projectRequesterId;
  var prColor = mapping.projectColor;
  // tasks
  var tId = mapping.taskId;
  var tTitle = mapping.taskTitle;
  var tStart = mapping.taskStartDate;
  var tEnd = mapping.taskEndDate;
  var tProg = mapping.taskProgress;
  var tPerson = mapping.taskPersonId;
  var tProject = mapping.taskProjectId;

  // ── Build persons ──
  var persons = [];
  var personRows = rawData.persons || [];
  for (var pi = 0; pi < personRows.length; pi++) {
    var row = personRows[pi];
    var id = (row[pId] || '').trim();
    if (!id) continue;
    persons.push({
      id: id,
      name: (row[pName] || id).trim(),
      position: (row[pPos] || '').trim() || undefined,
    });
  }

  // ── Build projects ──
  var projects = [];
  var projectRows = rawData.projects || [];
  for (var pj = 0; pj < projectRows.length; pj++) {
    var row2 = projectRows[pj];
    var prjId = (row2[prId] || '').trim();
    if (!prjId) continue;
    var proj = {
      id: prjId,
      name: (row2[prName] || prjId).trim(),
    };
    var requesterId = (row2[prReqId] || '').trim();
    if (requesterId) {
      // Look up person name for the requester
      var reqPerson = null;
      for (var k = 0; k < persons.length; k++) {
        if (persons[k].id === requesterId) { reqPerson = persons[k]; break; }
      }
      proj.requester = reqPerson ? reqPerson.name : requesterId;
    }
    var color = (row2[prColor] || '').trim();
    if (color) proj.color = color;
    projects.push(proj);
  }

  // ── Build tasks ──
  var tasks = [];
  var taskRows = rawData.tasks || [];
  for (var ti = 0; ti < taskRows.length; ti++) {
    var row3 = taskRows[ti];
    var taskId = (row3[tId] || '').trim();
    if (!taskId) continue;
    var task = {
      id: taskId,
      title: (row3[tTitle] || 'Untitled').trim(),
    };
    var sDate = (row3[tStart] || '').trim();
    var eDate = (row3[tEnd] || '').trim();
    var prog = (row3[tProg] || '').trim();
    var personId = (row3[tPerson] || '').trim();
    var projectId = (row3[tProject] || '').trim();

    if (sDate) task.startDate = sDate;
    if (eDate) task.endDate = eDate;
    if (prog !== '') {
      var pct = parseFloat(prog);
      if (!isNaN(pct)) task.progress = Math.max(0, Math.min(1, pct));
    }
    if (personId) task.personId = personId;
    if (projectId) task.projectId = projectId;

    tasks.push(task);
  }

  return {
    tasks: tasks,
    persons: persons,
    projects: projects,
  };
}

module.exports = { fetch: fetch, transform: transform };
