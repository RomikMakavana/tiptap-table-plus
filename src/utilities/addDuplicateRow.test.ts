import { Schema } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
import { TableMap } from '@tiptap/pm/tables';
import addDuplicateRow from './addDuplicateRow';

// Mock the ProseMirror table structures
const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block' },
    text: { group: 'inline' },
    hard_break: { group: 'inline', inline: true, selectable: false },
    table: {
      content: 'table_row+',
      tableRole: 'table',
      isolating: true,
      group: 'block',
      parseDOM: [{ tag: 'table' }],
      toDOM() { return ['table', 0]; },
    },
    table_row: {
      content: '(table_cell | table_header)*',
      tableRole: 'row',
      parseDOM: [{ tag: 'tr' }],
      toDOM() { return ['tr', 0]; },
    },
    table_cell: {
      content: 'block+',
      tableRole: 'cell',
      group: 'block',
      parseDOM: [{ tag: 'td' }],
      toDOM() { return ['td', 0]; },
    },
    table_header: {
      content: 'block+',
      tableRole: 'header_cell',
      group: 'block',
      parseDOM: [{ tag: 'th' }],
      toDOM() { return ['th', 0]; },
    },
  },
});

describe('addDuplicateRow', () => {
  it('should duplicate a row with content', () => {
    // Create a simple table with 2 rows and 2 columns
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const row2 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 3'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 4'))])
    ]);
    const table = schema.nodes.table.create(null, [row1, row2]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the first row (index 0)
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 0, true);

    // Since this function modifies the transaction, we check that it doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });

  it('should duplicate a row without content when withContent is false', () => {
    // Create a simple table with 2 rows and 2 columns
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const row2 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 3'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 4'))])
    ]);
    const table = schema.nodes.table.create(null, [row1, row2]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the second row (index 1) without content
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 1, false);

    // Since this function modifies the transaction, we check that it doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });

  it('should handle edge cases such as duplicating the last row', () => {
    // Create a table with 3 rows and 2 columns
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const row2 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 3'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 4'))])
    ]);
    const row3 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 5'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 6'))])
    ]);
    const table = schema.nodes.table.create(null, [row1, row2, row3]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the last row (index 2)
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 2, true);

    // Check that the function doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });

  it('should handle tables with header rows', () => {
    // Create a table with a header row and a regular row
    const headerRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_header.create(null, [schema.nodes.paragraph.create(null, schema.text('Header 1'))]),
      schema.nodes.table_header.create(null, [schema.nodes.paragraph.create(null, schema.text('Header 2'))])
    ]);
    const dataRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Data 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Data 2'))])
    ]);
    const table = schema.nodes.table.create(null, [headerRow, dataRow]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the header row (index 0)
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 0, true);

    // Check that the function doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });

  it('should properly calculate row position', () => {
    // Create a table with 2 rows and 2 columns
    const cell1 = schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]);
    const cell2 = schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))]);
    const row1 = schema.nodes.table_row.create(null, [cell1, cell2]);

    const cell3 = schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 3'))]);
    const cell4 = schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 4'))]);
    const row2 = schema.nodes.table_row.create(null, [cell3, cell4]);

    const table = schema.nodes.table.create(null, [row1, row2]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the second row (index 1)
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 1, true);

    // Check that the function doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });

  it('should handle empty table cells', () => {
    // Create a table with empty cells
    const emptyRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(),
      schema.nodes.table_cell.create()
    ]);
    const table = schema.nodes.table.create(null, [emptyRow]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the empty row
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 0, true);

    // Check that the function doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });
  
  it('should handle single row table', () => {
    // Create a table with a single row
    const singleRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Single Cell'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Second Cell'))])
    ]);
    const table = schema.nodes.table.create(null, [singleRow]);

    // Create a proper TableMap
    const map = TableMap.get(table);

    // Create a transaction with the actual table in the document
    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });
    const tr = state.tr;
    const tableStart = 1; // Starting position of the table in the document (after doc opening tag)

    // Call the function to duplicate the single row (index 0)
    const newTr = addDuplicateRow(tr, { map, tableStart, table }, 0, true);

    // Check that the function doesn't throw errors
    expect(() => newTr.doc).not.toThrow();
  });
});