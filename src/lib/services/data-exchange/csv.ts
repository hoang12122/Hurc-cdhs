const FORMULA_PREFIX = /^[=+\-@]/;

function safeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let text = typeof value === 'string' ? value : JSON.stringify(value);
  if (FORMULA_PREFIX.test(text)) text = `'${text}`;
  if (/[",\r\n]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function serializeCsv(rows: Array<Record<string, unknown>>, columns: string[]): string {
  const lines = [columns.map(safeCell).join(',')];
  for (const row of rows) lines.push(columns.map(column => safeCell(row[column])).join(','));
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

export function parseCsv(content: string, maxRows = 10_000): Array<Record<string, string>> {
  const input = content.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(cell.trim());
      cell = '';
    } else if (char === '\n') {
      row.push(cell.replace(/\r$/, '').trim());
      if (row.some(value => value !== '')) rows.push(row);
      if (rows.length > maxRows + 1) throw new Error(`CSV exceeds ${maxRows} data rows.`);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (quoted) throw new Error('CSV contains an unterminated quoted field.');
  row.push(cell.replace(/\r$/, '').trim());
  if (row.some(value => value !== '')) rows.push(row);
  if (rows.length < 1) return [];

  const headers = rows[0].map(header => header.trim());
  if (headers.some(header => !header)) throw new Error('CSV contains an empty header.');
  if (new Set(headers).size !== headers.length) throw new Error('CSV contains duplicate headers.');

  return rows.slice(1).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}
