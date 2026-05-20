import TableRowPlus from './TableRowPlus';

describe('TableRowPlus', () => {
  test('should extend TableRow correctly', () => {
    expect(TableRowPlus.name).toBe('tableRow');
  });

  test('should have node view configuration function', () => {
    // Verify that the extension has the expected addNodeView function
    expect(TableRowPlus.config.addNodeView).toBeDefined();
    expect(typeof TableRowPlus.config.addNodeView).toBe('function');
  });

  test('should maintain original TableRow functionality', () => {
    expect(TableRowPlus.configure).toBeDefined();
    expect(TableRowPlus.extend).toBeDefined();
  });

  test('should have correct configuration properties', () => {
    // Check that the extension has the necessary configuration
    expect(TableRowPlus.config).toBeDefined();

    // The node view function should exist
    expect(typeof TableRowPlus.config.addNodeView).toBe('function');
  });

  test('should be properly exported', () => {
    expect(TableRowPlus).toBeDefined();
    expect(typeof TableRowPlus).toBe('object');
  });
});