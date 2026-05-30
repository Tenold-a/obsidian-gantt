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

/**
 * Serialize an array of field values into a CSV row string.
 * Fields containing commas, double quotes, or newlines are quoted and escaped.
 */
function toCSVRow(fields, delimiter) {
  var d = delimiter || ',';
  var escaped = [];
  for (var i = 0; i < fields.length; i++) {
    var val = fields[i] == null ? '' : String(fields[i]);
    if (val.indexOf(d) !== -1 || val.indexOf('"') !== -1 || val.indexOf('\n') !== -1 || val.indexOf('\r') !== -1) {
      escaped.push('"' + val.replace(/"/g, '""') + '"');
    } else {
      escaped.push(val);
    }
  }
  return escaped.join(d);
}

/**
 * Push local changes back to CSV files.
 *
 * Reads the current CSV, updates matching rows by ID, appends new rows,
 * and removes deleted rows. Then writes the updated CSV back.
 */
async function push(payload, ctx) {
  if (!ctx.writeFile) {
    return { success: false, error: 'ctx.writeFile is not available on this platform' };
  }

  var paths = ctx.config.paths;
  if (!paths || !paths.tasks) {
    return { success: false, error: 'No CSV paths configured (config.paths.tasks is required)' };
  }

  var mapping = getMapping(ctx.config);
  var delimiter = ctx.config.delimiter || ',';

  try {
    // ── Push tasks ──
    if (payload.tasks && payload.tasks.length > 0 || payload.deletedTaskIds && payload.deletedTaskIds.length > 0) {
      await pushCSV(
        ctx, paths.tasks, delimiter,
        mapping.taskId,
        [mapping.taskId, mapping.taskTitle, mapping.taskStartDate, mapping.taskEndDate, mapping.taskProgress, mapping.taskPersonId, mapping.taskProjectId],
        payload.tasks || [],
        payload.deletedTaskIds || [],
        function (task) {
          var row = {};
          row[mapping.taskId] = task.id;
          if (task.title !== undefined) row[mapping.taskTitle] = task.title;
          if (task.startDate !== undefined) row[mapping.taskStartDate] = task.startDate;
          if (task.endDate !== undefined) row[mapping.taskEndDate] = task.endDate;
          if (task.progress !== undefined) row[mapping.taskProgress] = String(task.progress);
          if (task.personId !== undefined) row[mapping.taskPersonId] = task.personId;
          if (task.projectId !== undefined) row[mapping.taskProjectId] = task.projectId;
          return row;
        }
      );
    }

    // ── Push persons ──
    if (payload.persons && payload.persons.length > 0) {
      await pushCSV(
        ctx, paths.persons, delimiter,
        mapping.personId,
        [mapping.personId, mapping.personName, mapping.personPosition],
        payload.persons,
        [],
        function (person) {
          var row = {};
          row[mapping.personId] = person.id;
          if (person.name !== undefined) row[mapping.personName] = person.name;
          if (person.position !== undefined) row[mapping.personPosition] = person.position;
          return row;
        }
      );
    }

    // ── Push projects ──
    if (payload.projects && payload.projects.length > 0) {
      await pushCSV(
        ctx, paths.projects, delimiter,
        mapping.projectId,
        [mapping.projectId, mapping.projectName, mapping.projectRequesterId, mapping.projectColor],
        payload.projects,
        payload.deletedProjectIds || [],
        function (project) {
          var row = {};
          row[mapping.projectId] = project.id;
          if (project.name !== undefined) row[mapping.projectName] = project.name;
          if (project.requester !== undefined) row[mapping.projectRequesterId] = project.requester;
          if (project.color !== undefined) row[mapping.projectColor] = project.color;
          return row;
        }
      );
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.message || String(e) };
  }
}

/**
 * Update a single CSV file: read, find matching rows by ID, update/insert/delete, write back.
 * Preserves the original CSV header line and any extra columns not being modified.
 */
async function pushCSV(ctx, path, delimiter, idColumn, knownColumns, entities, deletedIds, buildRow) {
  var content = await ctx.readFile(path);
  var lines = content.split(/\r?\n/);

  // Extract the actual header line (first non-empty line)
  var headerLine = '';
  var headerStartIdx = 0;
  for (var li = 0; li < lines.length; li++) {
    if (lines[li].trim() !== '') {
      headerLine = lines[li];
      headerStartIdx = li;
      break;
    }
  }

  if (!headerLine) {
    // File is empty — write header from knownColumns + entities
    var newLines = [toCSVRow(knownColumns, delimiter)];
    for (var i = 0; i < entities.length; i++) {
      var rowData = buildRow(entities[i]);
      var fields = knownColumns.map(function (col) {
        return rowData[col] != null ? String(rowData[col]) : '';
      });
      newLines.push(toCSVRow(fields, delimiter));
    }
    await ctx.writeFile(path, newLines.join('\n') + '\n');
    return;
  }

  // Parse the actual headers from the file
  var actualHeaders = parseCSVLine(headerLine, delimiter);

  // Build a combined header set: actual headers + any knownColumns not in actual
  var allHeaders = actualHeaders.slice();
  for (var kc = 0; kc < knownColumns.length; kc++) {
    var kcol = knownColumns[kc];
    var found = false;
    for (var ah = 0; ah < allHeaders.length; ah++) {
      if (allHeaders[ah] === kcol) { found = true; break; }
    }
    if (!found) allHeaders.push(kcol);
  }

  // Parse data rows (skip header line)
  var dataLines = [];
  for (var dl = headerStartIdx + 1; dl < lines.length; dl++) {
    if (lines[dl].trim() !== '') dataLines.push(lines[dl]);
  }
  var csvData = headerLine + '\n' + dataLines.join('\n');
  var records = ctx.parseCSV(csvData, { delimiter: delimiter });

  // Build a map of ID → row index
  var idIndexMap = {};
  for (var ri = 0; ri < records.length; ri++) {
    var rowId = (records[ri][idColumn] || '').trim();
    if (rowId) {
      idIndexMap[rowId] = ri;
    }
  }

  // Build a set of deleted IDs for fast lookup
  var deletedSet = {};
  if (deletedIds) {
    for (var di = 0; di < deletedIds.length; di++) {
      deletedSet[deletedIds[di]] = true;
    }
  }

  // Apply updates to existing rows
  for (var ei = 0; ei < entities.length; ei++) {
    var entity = entities[ei];
    var rowData = buildRow(entity);
    var entityId = entity.id;

    if (idIndexMap.hasOwnProperty(entityId)) {
      // Update existing row — only overwrite fields present in rowData
      var targetIdx = idIndexMap[entityId];
      var dataKeys = Object.keys(rowData);
      for (var dk = 0; dk < dataKeys.length; dk++) {
        var dcol = dataKeys[dk];
        records[targetIdx][dcol] = rowData[dcol];
      }
    } else {
      // Append new row with all known columns
      var newRow = {};
      for (var h2 = 0; h2 < allHeaders.length; h2++) {
        var col2 = allHeaders[h2];
        newRow[col2] = rowData.hasOwnProperty(col2) ? rowData[col2] : '';
      }
      records.push(newRow);
    }
  }

  // Write back: use actualHeaders order, then any extra known columns
  var outHeaders = actualHeaders.slice();
  for (var ek = 0; ek < knownColumns.length; ek++) {
    var ekcol = knownColumns[ek];
    var ekfound = false;
    for (var eka = 0; eka < outHeaders.length; eka++) {
      if (outHeaders[eka] === ekcol) { ekfound = true; break; }
    }
    if (!ekfound) outHeaders.push(ekcol);
  }

  var outLines = [toCSVRow(outHeaders, delimiter)];
  for (var oi = 0; oi < records.length; oi++) {
    var recordId = (records[oi][idColumn] || '').trim();
    if (deletedSet.hasOwnProperty(recordId)) continue;
    var outFields = [];
    for (var oh = 0; oh < outHeaders.length; oh++) {
      var val = records[oi][outHeaders[oh]];
      outFields.push(val != null ? val : '');
    }
    outLines.push(toCSVRow(outFields, delimiter));
  }

  await ctx.writeFile(path, outLines.join('\n') + '\n');
}

/**
 * Parse a single CSV line into fields (no header mapping).
 */
function parseCSVLine(line, delimiter) {
  var fields = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delimiter && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

module.exports = { fetch: fetch, transform: transform, push: push };
