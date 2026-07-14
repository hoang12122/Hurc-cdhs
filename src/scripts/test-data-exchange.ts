import assert from 'node:assert/strict';
import { parseCsv, serializeCsv } from '../lib/services/data-exchange/csv';

function main() {
  const csv = serializeCsv([
    { id: 'DNF-001', description: 'Door, jammed', formula: '=HYPERLINK("bad")', notes: 'line 1\nline 2' },
  ], ['id', 'description', 'formula', 'notes']);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes("'=HYPERLINK"));

  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 'DNF-001');
  assert.equal(rows[0].description, 'Door, jammed');
  assert.equal(rows[0].formula, "'=HYPERLINK(\"bad\")");
  assert.equal(rows[0].notes, 'line 1\nline 2');

  assert.throws(() => parseCsv('a,a\n1,2\n'), /duplicate headers/);
  assert.throws(() => parseCsv('a\n"unterminated'), /unterminated quoted field/);
  console.log('Operational data exchange CSV invariant checks passed.');
}

main();
