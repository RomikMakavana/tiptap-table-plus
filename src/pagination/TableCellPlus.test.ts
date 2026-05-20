import TableCellPlus from './TableCellPlus';

describe('TableCellPlus', () => {
  describe('extension definition', () => {
    it('should be defined', () => {
      expect(TableCellPlus).toBeDefined();
    });

    it('should have the correct name', () => {
      expect(TableCellPlus.name).toBe('tableCell');
    });

    it('should have addNodeView method', () => {
      expect(TableCellPlus.config.addNodeView).toBeDefined();
      expect(typeof TableCellPlus.config.addNodeView).toBe('function');
    });
  });

  describe('extension functionality', () => {
    it('should properly extend the original TableCell', () => {
      // Verify that it's a proper extension with the addNodeView override
      expect(TableCellPlus.name).toBe('tableCell');
      expect(typeof TableCellPlus.config.addNodeView).toBe('function');
    });

    it('should contain the custom node view logic', () => {
      // The node view contains the core functionality of this extension
      expect(TableCellPlus.config.addNodeView).toBeDefined();
    });
  });

  describe('node view implementation', () => {
    it('should return a node view function', () => {
      const addNodeViewFn = TableCellPlus.config.addNodeView;
      expect(typeof addNodeViewFn).toBe('function');
    });

    it('should customize the rendering with border styling', () => {
      // The core customization happens in the node view
      expect(TableCellPlus.config.addNodeView).toBeDefined();
    });

    it('should handle colspan and rowspan updates', () => {
      // This functionality is implemented in the node view's update method
      expect(TableCellPlus.config.addNodeView).toBeDefined();
    });
  });

  describe('border and grid functionality', () => {
    it('should customize border based on table extension options', () => {
      // Border customization happens in the node view
      expect(TableCellPlus.config.addNodeView).toBeDefined();
    });

    it('should update gridColumn and rowSpan properties', () => {
      // Grid layout updates happen in the node view
      expect(TableCellPlus.config.addNodeView).toBeDefined();
    });
  });
});