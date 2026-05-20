import { TablePlusOptions } from './types';

describe('TablePlusOptions', () => {
    // Test type compatibility and the presence of custom properties
    it('should have the custom properties defined', () => {
        // Creating a type assertion that we'll use for testing purposes
        // Since TablePlusOptions extends TableOptions, we need to make sure our test object
        // contains required fields from TableOptions too
        const testObj = {
            // TableOptions properties would be here, but we'll skip them for the test
            // and only focus on what we're adding
            resizeHandleStyle: {
                backgroundColor: 'red',
                width: '10px'
            },
            minColumnSize: 50,
            borderColor: '#000000'
        };

        // Cast the object to TablePlusOptions for testing our specific properties
        const tablePlusOptions = testObj as TablePlusOptions;

        // Check that our custom properties are present
        expect(tablePlusOptions.resizeHandleStyle).toEqual({
            backgroundColor: 'red',
            width: '10px'
        });
        expect(tablePlusOptions.minColumnSize).toBe(50);
        expect(tablePlusOptions.borderColor).toBe('#000000');
    });

    // Test partial CSSStyleDeclaration typing
    it('should properly type resizeHandleStyle as Partial<CSSStyleDeclaration>', () => {
        const partialStyle: Partial<CSSStyleDeclaration> = {
            backgroundColor: 'blue',
            cursor: 'pointer'
        };

        const tablePlusOptions = {
            resizeHandleStyle: partialStyle,
            minColumnSize: 25,
            borderColor: '#ff0000'
        } as TablePlusOptions;

        expect(tablePlusOptions.resizeHandleStyle?.backgroundColor).toBe('blue');
        expect(tablePlusOptions.resizeHandleStyle?.cursor).toBe('pointer');
        expect(tablePlusOptions.minColumnSize).toBe(25);
        expect(tablePlusOptions.borderColor).toBe('#ff0000');
    });

    // Test that custom properties can be undefined
    it('should allow custom properties to be undefined', () => {
        // Just checking that the interface allows our custom properties to be undefined
        // by verifying TypeScript compilation (this test is more about type checking)
        const tablePlusOptions = {} as TablePlusOptions;

        // Check that accessing our custom properties doesn't cause runtime errors
        expect(() => {
            const resizeStyle = tablePlusOptions.resizeHandleStyle;
            const minColSize = tablePlusOptions.minColumnSize;
            const borderCol = tablePlusOptions.borderColor;

            expect(resizeStyle).toBeUndefined();
            expect(minColSize).toBeUndefined();
            expect(borderCol).toBeUndefined();
        }).not.toThrow();
    });

    // Test the interface structure through type checking
    it('should properly extend TableOptions', () => {
        // This is mainly a compile-time test to ensure the interface is structured correctly
        const tablePlusOptions: TablePlusOptions = {
            resizeHandleStyle: {
                backgroundColor: 'yellow'
            },
            minColumnSize: 75,
            borderColor: '#abcdef'
        } as TablePlusOptions;

        // Verify the custom properties exist and are accessible
        expect(tablePlusOptions.resizeHandleStyle).toBeDefined();
        expect(tablePlusOptions.minColumnSize).toBe(75);
        expect(tablePlusOptions.borderColor).toBe('#abcdef');
    });

    // Test that minColumnSize and borderColor can be assigned values
    it('should correctly type minColumnSize and borderColor', () => {
        const tablePlusOptions = {
            minColumnSize: 100,
            borderColor: '#123456'
        } as TablePlusOptions;

        expect(tablePlusOptions.minColumnSize).toBe(100);
        expect(tablePlusOptions.borderColor).toBe('#123456');
    });
});