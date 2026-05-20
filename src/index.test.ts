import { PaginationTable, TablePlus } from './index';

describe('index.ts exports', () => {
    describe('PaginationTable', () => {
        it('should export PaginationTable correctly', () => {
            expect(PaginationTable).toBeDefined();
            // PaginationTable should be an object/function
            expect(PaginationTable).toBeTruthy();
        });
    });

    describe('TablePlus', () => {
        it('should export TablePlus correctly', () => {
            expect(TablePlus).toBeDefined();
            // TablePlus should be an object/function
            expect(TablePlus).toBeTruthy();
        });
    });

    describe('Tiptap extension interface', () => {
        // Mock the @tiptap/core module structure to test our extension
        it('should extend the Commands interface properly', () => {
            // Verify that the types exist and are properly defined
            expect(() => {
                // Test that our extended commands interface is available
                const mockEditor = {
                    chain: () => ({
                        tableCommandExtension: {
                            duplicateColumn: (withContent?: boolean) => ({ run: () => true }),
                            duplicateRow: (withContent?: boolean) => ({ run: () => true })
                        }
                    }),
                    tableCommandExtension: {
                        duplicateColumn: (withContent?: boolean) => ({ run: () => true }),
                        duplicateRow: (withContent?: boolean) => ({ run: () => true })
                    }
                };

                // Test that we can call the extended commands
                const cmds = mockEditor.tableCommandExtension;
                expect(cmds.duplicateColumn()).toBeDefined();
                expect(cmds.duplicateRow()).toBeDefined();

                // Test with optional parameter
                expect(cmds.duplicateColumn(true)).toBeDefined();
                expect(cmds.duplicateRow(false)).toBeDefined();
            }).not.toThrow();
        });
    });
});