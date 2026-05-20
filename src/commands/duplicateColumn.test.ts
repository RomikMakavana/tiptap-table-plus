import { Schema } from '@tiptap/pm/model';
import { EditorState } from '@tiptap/pm/state';
import { Transaction } from '@tiptap/pm/state';
import { TableMap } from '@tiptap/pm/tables';
import duplicateColumn from './duplicateColumn';

// Mock the external utilities used by duplicateColumn, including addDuplicateColumn
jest.mock('../utilities/addDuplicateColumn', () => {
  return jest.fn((tr, rect, col, withContent) => {
    // Return the transaction as-is to avoid complex processing
    return tr;
  });
});

// Also mock the @tiptap/pm/tables module
jest.mock('@tiptap/pm/tables', () => {
  const actual = jest.requireActual('@tiptap/pm/tables');
  
  return {
    ...actual,
    isInTable: jest.fn((state) => {
      // Mock implementation: return true if there's a table in the state
      // This will be overridden in individual tests as needed
      return state && typeof state.doc !== 'undefined';
    }),
    selectedRect: jest.fn((state) => {
      // Mock implementation: return a basic rectangle object
      // This will be overridden in individual tests as needed
      return {
        map: TableMap.get(state.doc.firstChild!), // Assuming first child is the table
        tableStart: 1,
        table: state.doc.firstChild!,
        left: 0,
        right: 1,
        top: 0,
        bottom: 1
      };
    })
  };
});

// Import the mocked functions
import { isInTable, selectedRect } from '@tiptap/pm/tables';
import addDuplicateColumn from '../utilities/addDuplicateColumn';

// Define a basic schema for testing tables
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

describe('duplicateColumn', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof duplicateColumn).toBe('function');
  });

  it('should return false when not in a table', () => {
    // Mock isInTable to return false
    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(false);
    
    // Create a state without a table
    const doc = schema.node('doc', null, [
      schema.nodes.paragraph.create(null, schema.text('Not in table'))
    ]);
    const state = EditorState.create({ doc });
    
    const result = duplicateColumn(state, undefined);
    expect(result).toBe(false);
    
    // Verify isInTable was called with the state
    expect(isInTable).toHaveBeenCalledWith(state);
  });

  it('should return true when in a table and dispatch is provided', () => {
    // Create a table
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    // Mock isInTable to return true and selectedRect to return valid data
    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected (for duplication)
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    // Mock dispatch function to verify it gets called
    const mockDispatch = jest.fn();

    const result = duplicateColumn(state, mockDispatch);
    expect(result).toBe(true);
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Verify the functions were called correctly - addDuplicateColumn should have been called
    expect(isInTable).toHaveBeenCalledWith(state);
    expect(selectedRect).toHaveBeenCalledWith(state);

    // Use toHaveBeenCalledWith matcher but in a way that avoids timestamp mismatches
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    const callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should return true when in a table but dispatch is not provided', () => {
    // Create a table
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    // Mock isInTable to return true and selectedRect to return valid data
    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    // Note: if dispatch is undefined, selectedRect won't be called because the
    // duplicateColumn function only calls selectedRect inside the `if (dispatch)` block
    const result = duplicateColumn(state, undefined);
    expect(result).toBe(true);

    // Verify that isInTable was called but selectedRect and addDuplicateColumn weren't because
    // dispatch is undefined, so they wouldn't be called in the conditional block
    expect(isInTable).toHaveBeenCalledWith(state);
    // In the actual function, selectedRect is not called when dispatch is undefined
    expect(selectedRect).not.toHaveBeenCalled();
    expect(addDuplicateColumn).not.toHaveBeenCalled();
  });

  it('should call dispatch with the correct parameters when in table', () => {
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected for duplication
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    const mockDispatch = jest.fn();

    duplicateColumn(state, mockDispatch, true);

    // Check that dispatch was called with the result of addDuplicateColumn
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Use toHaveBeenCalledWith matcher but in a way that avoids timestamp mismatches
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    const callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should handle the withContent parameter correctly', () => {
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))])
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected for duplication
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    const mockDispatch = jest.fn();

    // Test with withContent = false
    duplicateColumn(state, mockDispatch, false);

    // Verify the call with withContent = false
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    let callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(false); // Fourth arg is the withContent flag

    // Reset and test with withContent = true
    (addDuplicateColumn as jest.Mock).mockClear();
    duplicateColumn(state, mockDispatch, true);

    // Verify the call with withContent = true
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should work with different column selections', () => {
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 2'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Cell 3'))])
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 1,  // Column 1 is selected for duplication
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    const mockDispatch = jest.fn();

    const result = duplicateColumn(state, mockDispatch, true);
    expect(result).toBe(true);

    // Use toHaveBeenCalledWith matcher but in a way that avoids timestamp mismatches
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    const callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(1); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should work with tables containing header cells', () => {
    const headerRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_header.create(null, [schema.nodes.paragraph.create(null, schema.text('Header 1'))]),
      schema.nodes.table_header.create(null, [schema.nodes.paragraph.create(null, schema.text('Header 2'))])
    ]);
    const dataRow = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Data 1'))]),
      schema.nodes.table_cell.create(null, [schema.nodes.paragraph.create(null, schema.text('Data 2'))])
    ]);
    const table = schema.nodes.table.create(null, [headerRow, dataRow]);

    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected for duplication
      top: 0,
      bottom: 2
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    const mockDispatch = jest.fn();

    const result = duplicateColumn(state, mockDispatch, true);
    expect(result).toBe(true);

    // Use toHaveBeenCalledWith matcher but in a way that avoids timestamp mismatches
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    const callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should handle empty table cells', () => {
    const row1 = schema.nodes.table_row.create(null, [
      schema.nodes.table_cell.create(),
      schema.nodes.table_cell.create()
    ]);
    const table = schema.nodes.table.create(null, [row1]);

    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(true);

    const mockMap = TableMap.get(table);
    const rectResult = {
      map: mockMap,
      tableStart: 1,
      table: table,
      left: 0,
      right: 0,  // Column 0 is selected for duplication
      top: 0,
      bottom: 1
    };
    (selectedRect as jest.MockedFunction<typeof selectedRect>).mockReturnValue(rectResult);

    const doc = schema.node('doc', null, [table]);
    const state = EditorState.create({ doc });

    const mockDispatch = jest.fn();

    const result = duplicateColumn(state, mockDispatch, true);
    expect(result).toBe(true);

    // Use toHaveBeenCalledWith matcher but in a way that avoids timestamp mismatches
    expect(addDuplicateColumn).toHaveBeenCalledTimes(1);
    const callArgs = (addDuplicateColumn as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Transaction); // First arg is transaction
    expect(callArgs[1]).toEqual(rectResult); // Second arg is the rect
    expect(callArgs[2]).toBe(0); // Third arg is the column index
    expect(callArgs[3]).toBe(true); // Fourth arg is the withContent flag
  });

  it('should return false with minimal setup when not in table', () => {
    // Mock to return false immediately
    (isInTable as jest.MockedFunction<typeof isInTable>).mockReturnValue(false);
    
    const doc = schema.node('doc', null, [
      schema.nodes.paragraph.create(null, schema.text('Some text'))
    ]);
    const state = EditorState.create({ doc });
    
    const mockDispatch = jest.fn();
    
    const result = duplicateColumn(state, mockDispatch);
    expect(result).toBe(false);
    // dispatch should not be called when not in table
    expect(mockDispatch).not.toHaveBeenCalled();
    // addDuplicateColumn should not be called when not in table
    expect(addDuplicateColumn).not.toHaveBeenCalled();
  });
});