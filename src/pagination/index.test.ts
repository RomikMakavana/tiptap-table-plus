import PaginationTable from './index';
import { TablePlus } from './TablePlus';
import { TableCellPlus } from './TableCellPlus';
import { TableHeaderPlus } from './TableHeaderPlus';
import { TableRowPlus } from './TableRowPlus';

describe('PaginationTable', () => {
  it('should export TablePlus', () => {
    expect(PaginationTable.TablePlus).toBeDefined();
    expect(PaginationTable.TablePlus).toBe(TablePlus);
  });

  it('should export TableCellPlus', () => {
    expect(PaginationTable.TableCellPlus).toBeDefined();
    expect(PaginationTable.TableCellPlus).toBe(TableCellPlus);
  });

  it('should export TableHeaderPlus', () => {
    expect(PaginationTable.TableHeaderPlus).toBeDefined();
    expect(PaginationTable.TableHeaderPlus).toBe(TableHeaderPlus);
  });

  it('should export TableRowPlus', () => {
    expect(PaginationTable.TableRowPlus).toBeDefined();
    expect(PaginationTable.TableRowPlus).toBe(TableRowPlus);
  });

  it('should have all required properties in the exported object', () => {
    const expectedKeys = ['TablePlus', 'TableCellPlus', 'TableHeaderPlus', 'TableRowPlus'];
    const actualKeys = Object.keys(PaginationTable);
    
    expect(actualKeys).toHaveLength(expectedKeys.length);
    expectedKeys.forEach(key => {
      expect(actualKeys).toContain(key);
    });
  });

  it('should have correct property types', () => {
    expect(typeof PaginationTable.TablePlus.configure).toBe('function'); // Tiptap extensions have configure method
    expect(typeof PaginationTable.TableCellPlus.configure).toBe('function');
    expect(typeof PaginationTable.TableHeaderPlus.configure).toBe('function');
    expect(typeof PaginationTable.TableRowPlus.configure).toBe('function');
  });

  it('should create a valid object structure', () => {
    expect(PaginationTable).toHaveProperty('TablePlus');
    expect(PaginationTable).toHaveProperty('TableCellPlus');
    expect(PaginationTable).toHaveProperty('TableHeaderPlus');
    expect(PaginationTable).toHaveProperty('TableRowPlus');

    // Verify they are all defined as objects/functions (Tiptap extensions)
    expect(PaginationTable.TablePlus).toBeTruthy();
    expect(PaginationTable.TableCellPlus).toBeTruthy();
    expect(PaginationTable.TableHeaderPlus).toBeTruthy();
    expect(PaginationTable.TableRowPlus).toBeTruthy();
  });

  it('should return the same instance when accessed multiple times', () => {
    const firstAccess = PaginationTable;
    const secondAccess = PaginationTable;
    
    expect(firstAccess).toBe(secondAccess);
  });
});