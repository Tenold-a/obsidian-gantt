export interface CsvParseOptions {
  /** Field delimiter character. Default: ',' */
  delimiter?: string;
}

/**
 * Parse a CSV text string into an array of record objects keyed by header row values.
 *
 * RFC 4180 compliant: handles quoted fields, escaped quotes (doubled),
 * embedded delimiters and newlines within quoted fields, and UTF-8 BOM.
 */
export function parseCSV(
  text: string,
  options: CsvParseOptions = {},
): Record<string, string>[] {
  const delimiter = options.delimiter ?? ',';

  if (!text) return [];

  // Strip UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rows = splitRows(text);
  if (rows.length === 0) return [];

  const headers = parseRow(rows[0], delimiter);
  const results: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const fields = parseRow(rows[i], delimiter);
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = fields[j] ?? '';
    }
    results.push(record);
  }

  return results;
}

/** Split text into raw row strings, respecting quoted newlines. */
function splitRows(text: string): string[] {
  const rows: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === '\n' && !inQuotes) {
      rows.push(current);
      current = '';
    } else {
      current += ch;
    }
  }

  // Don't add a trailing empty row if the text ends with \n
  if (current.length > 0) {
    rows.push(current);
  }

  return rows;
}

/** Parse a single row into fields, respecting quoted delimiters. */
function parseRow(row: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const ch = row[i];

    if (ch === '"') {
      if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
        // Escaped quote (doubled)
        current += '"';
        i++; // skip next quote
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
