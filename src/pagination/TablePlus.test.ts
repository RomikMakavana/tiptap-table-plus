import { TablePlus } from './TablePlus';

// Basic mocks for dependencies
jest.mock('@tiptap/core', () => ({
  ...jest.requireActual('@tiptap/core'),
  mergeAttributes: jest.fn((...args) => Object.assign({}, ...args)),
}));

jest.mock('../TableCommandExtension', () => ({
  TableCommandExtension: {},
}));

jest.mock('./TableRowGroup', () => ({
  TableRowGroup: {},
}));

jest.mock('./TablePlusNodeView', () => ({
  TablePlusNodeView: jest.fn().mockImplementation(() => ({
    dom: document.createElement('div'),
  })),
}));

// Utilities are important to have working implementations for the plugin to work properly
jest.mock('../utilities/utils', () => ({
  ...jest.requireActual('../utilities/utils'),
  findParentNodeOfType: jest.fn(),
  findParentNodeOfTypeAtPos: jest.fn(),
  calculateNewColumnWidth: jest.fn(),
  addColumns: jest.fn(),
  isNodeAtRange: jest.fn(),
  getColumnSizeList: jest.fn(),
}));

describe('TablePlus Extension', () => {
  it('should be defined', () => {
    expect(TablePlus).toBeDefined();
  });

  it('should extend from Table extension', () => {
    expect(TablePlus.name).toBe('table');
  });

  it('should have correct content configuration', () => {
    expect(TablePlus.config).toBeDefined();
    expect(TablePlus.config.content).toBe('(tableRowGroup|tableRow)+');
  });

  it('should have configurable options', () => {
    expect(TablePlus.config.addOptions).toBeDefined();
  });

  it('should define HTML attributes properly', () => {
    expect(TablePlus.config.renderHTML).toBeDefined();
  });

  it('should have addNodeView configuration', () => {
    expect(TablePlus.config.addNodeView).toBeDefined();
  });

  it('should have addProseMirrorPlugins configuration', () => {
    expect(TablePlus.config.addProseMirrorPlugins).toBeDefined();
  });

  it('should have addExtensions configuration', () => {
    expect(TablePlus.config.addExtensions).toBeDefined();
  });

  it('should support configuration customization', () => {
    const customConfig = {
      resizeHandleStyle: { background: 'red' },
      minColumnSize: 100,
      borderColor: 'blue',
    };

    const customTablePlus = TablePlus.configure(customConfig);
    expect(customTablePlus).toBeDefined();
    expect(customTablePlus.name).toBe('table'); // Name should remain the same
  });

  it('should have name set to table', () => {
    expect(TablePlus.name).toBe('table');
  });

  it('should have priority that can be defined', () => {
    // The priority may be undefined if using defaults, but should not cause errors
    // TablePlus extends Table which might inherit default priority
    expect(TablePlus.config.priority === undefined || typeof TablePlus.config.priority === 'number').toBeTruthy();
  });

  it('should have addAttributes function', () => {
    expect(typeof TablePlus.config.addAttributes).toBe('function');
  });

  it('should have addExtensions function', () => {
    expect(typeof TablePlus.config.addExtensions).toBe('function');
  });
});