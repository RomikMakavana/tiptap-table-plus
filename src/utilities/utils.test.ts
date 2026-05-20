import {
  getNodesAtPos,
  findParentNodeOfTypeAtPos,
  findParentNodeOfType,
  isNodeAtRange,
  getColumnSizeList,
  addColumns,
  calculateNewColumnWidth,
} from "./utils";

// Define minimal interfaces to match the expected types
interface MockNodeType {
  name: string;
  equals: (other: MockNodeType) => boolean;
}

// Create a factory function to create a mock NodeType that matches the expected interface
function createMockNodeType(name: string): MockNodeType {
  return {
    name,
    equals: (other: MockNodeType) => other.name === name
  };
}

// Mock Node class
class MockNode {
  type: any; // Using 'any' to avoid complex type issues
  nodeSize: number;

  constructor(typeName: string, nodeSize: number = 10) {
    this.type = createMockNodeType(typeName);
    this.nodeSize = nodeSize;
  }
}

// Mock Pos class
class MockResolvedPos {
  depth: number;
  _pos: number;
  _doc: any;

  constructor(pos: number, doc: any) {
    this._pos = pos;
    this._doc = doc;
    this.depth = 1; // Simplified
  }

  node(depth: number) {
    // Return a mock node for the given depth
    return new MockNode("paragraph"); // Default
  }

  start(depth: number) {
    return 0; // Simplified
  }

  end(depth: number) {
    return 10; // Simplified
  }

  before(depth: number) {
    return 0; // Simplified
  }
}

// Mock Document
class MockDoc {
  text: string;

  constructor(text: string = "default") {
    this.text = text;
  }

  resolve(pos: number) {
    return new MockResolvedPos(pos, this);
  }

  descendants(callback: (node: any, pos: number) => boolean | void) {
    // Mock implementation that simulates traversing document
    callback({ type: { name: 'paragraph' } }, 0);
    callback({ type: { name: 'text' } }, 1);
  }
}

// Mock EditorState
class MockEditorState {
  doc: MockDoc;

  constructor(doc: MockDoc) {
    this.doc = doc;
  }
}

describe("utils.ts", () => {
  describe("getNodesAtPos", () => {
    it("should return an array of nodes at the given position", () => {
      const mockDoc = new MockDoc("test content");
      const mockState = new MockEditorState(mockDoc);

      const result = getNodesAtPos(mockState as any, 5);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle positions at depth 0", () => {
      const mockDoc = new MockDoc("test content");
      const mockState = new MockEditorState(mockDoc);

      const result = getNodesAtPos(mockState as any, 0);
      expect(result).toBeInstanceOf(Array);
      expect(result[0].depth).toBeGreaterThanOrEqual(0);
    });
  });

  describe("findParentNodeOfTypeAtPos", () => {
    it("should find a parent node of the specified type", () => {
      const mockNodeType = createMockNodeType("paragraph");
      const mockDoc = {
        resolve: (pos: number) => ({
          depth: 1,
          node: (depth: number) => ({ type: mockNodeType }), // Same object reference
          before: (depth: number) => 0,
        }),
      };

      const result = findParentNodeOfTypeAtPos(5, mockDoc as any, mockNodeType as any);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.node.type.name).toBe("paragraph");
      }
    });

    it("should return null if no matching node type is found", () => {
      const mockDoc = {
        resolve: (pos: number) => ({
          depth: 1,
          node: (depth: number) => ({ type: createMockNodeType("heading") }),
          before: (depth: number) => 0,
        }),
      };

      const nodeType = createMockNodeType("paragraph");
      const result = findParentNodeOfTypeAtPos(5, mockDoc as any, nodeType as any);
      expect(result).toBeNull();
    });
  });

  describe("findParentNodeOfType", () => {
    it("should find a parent node of the specified type with state", () => {
      const mockNodeType = createMockNodeType("paragraph");
      const mockState = {
        doc: {
          resolve: (pos: number) => ({
            depth: 1,
            node: (depth: number) => ({ type: mockNodeType }), // Same object reference
            start: (depth: number) => 0,
            end: (depth: number) => 10,
            before: (depth: number) => depth > 0 ? 0 : 0,
          }),
        },
      };

      const result = findParentNodeOfType(mockState as any, 5, mockNodeType as any);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.node.type.name).toBe("paragraph");
      }
    });

    it("should return null if no matching node type is found with state", () => {
      const mockState = {
        doc: {
          resolve: (pos: number) => ({
            depth: 1,
            node: (depth: number) => ({ type: createMockNodeType("heading") }),
            start: (depth: number) => 0,
            end: (depth: number) => 10,
            before: (depth: number) => depth > 0 ? 0 : 0,
          }),
        },
      };

      const nodeType = createMockNodeType("paragraph");
      const result = findParentNodeOfType(mockState as any, 5, nodeType as any);
      expect(result).toBeNull();
    });
  });

  describe("isNodeAtRange", () => {
    it("should return true if a node exists at the specified range", () => {
      const mockState = {
        doc: {
          descendants: (callback: (node: any, pos: number) => boolean | void) => {
            // Simulate a paragraph that starts at position 0 and ends at position 10
            callback({ type: { name: "paragraph" }, nodeSize: 10 }, 0);
          },
        },
      };

      const result = isNodeAtRange(mockState as any, 0, 10, ["paragraph"]);
      expect(result).toBe(true);
    });

    it("should return false if no node exists at the specified range", () => {
      const mockState = {
        doc: {
          descendants: (callback: (node: any, pos: number) => boolean | void) => {
            // A node starts at position 5, not at position 0
            callback({ type: { name: "paragraph" }, nodeSize: 10 }, 5);
          },
        },
      };

      const result = isNodeAtRange(mockState as any, 0, 10, ["paragraph"]);
      expect(result).toBe(false);
    });

    it("should return false if node type doesn't match", () => {
      const mockState = {
        doc: {
          descendants: (callback: (node: any, pos: number) => boolean | void) => {
            callback({ type: { name: "heading" }, nodeSize: 10 }, 0);
          },
        },
      };

      const result = isNodeAtRange(mockState as any, 0, 10, ["paragraph"]);
      expect(result).toBe(false);
    });
  });

  describe("getColumnSizeList", () => {
    it("should parse a comma-separated string of numbers correctly", () => {
      const result = getColumnSizeList("10, 20, 30");
      expect(result).toEqual([10, 20, 30]);
    });

    it("should handle extra spaces", () => {
      const result = getColumnSizeList(" 10 , 20 , 30 ");
      expect(result).toEqual([10, 20, 30]);
    });

    it("should return an empty array for invalid input", () => {
      const result = getColumnSizeList("10, abc, 30");
      expect(result).toEqual([]);
    });

    it("should return an empty array for empty string", () => {
      const result = getColumnSizeList("");
      expect(result).toEqual([]);
    });

    it("should handle single number", () => {
      const result = getColumnSizeList("50");
      expect(result).toEqual([50]);
    });

    it("should handle decimal numbers", () => {
      const result = getColumnSizeList("10.5, 20.7, 30");
      expect(result).toEqual([10.5, 20.7, 30]);
    });
  });

  describe("addColumns", () => {
    it("should add new columns while preserving proportions of existing columns", () => {
      const widths: number[] = [40, 60]; // Total = 100%
      const newWidths: number[] = [25, 25]; // Total = 50%
      // Remaining space = 100% - 50% = 50%
      // Existing columns scaled: [40*(50/100)=20, 60*(50/100)=30]
      const result = addColumns(widths, newWidths);
      expect(result).toEqual([20, 30, 25, 25]);
    });

    it("should handle when total exceeds 100%", () => {
      const widths: number[] = [20]; // This doesn't affect the check
      const newWidths: number[] = [101]; // Total = 101 > 100, so remaining will be -1
      expect(() => addColumns(widths, newWidths)).toThrow("New widths exceed 100%");
    });

    it("should handle empty widths array", () => {
      const widths: number[] = [];
      const newWidths: number[] = [20, 30];
      const result = addColumns(widths, newWidths);
      expect(result).toEqual([20, 30]);
    });

    it("should handle when new widths sum exactly to 100%", () => {
      const widths: number[] = [40]; // Doesn't matter since existing will be scaled to 0
      const newWidths: number[] = [100]; // This makes remaining = 100 - 100 = 0
      const result = addColumns(widths, newWidths);
      // totalNew = 100, remaining = 100 - 100 = 0, so existing widths become 0
      expect(result).toEqual([0, 100]);
    });

    it("should handle when new widths sum to less than 100%", () => {
      const widths: number[] = [50, 50]; // Total = 100
      const newWidths: number[] = [30]; // Total = 30
      // remaining = 100 - 30 = 70
      // scaled = [(50/100)*70, (50/100)*70] = [35, 35]
      const result = addColumns(widths, newWidths);
      expect(result).toEqual([35, 35, 30]);
    });
  });

  describe("calculateNewColumnWidth", () => {
    it("should calculate equal width for all columns", () => {
      // 3 existing columns + 1 new = 4 total columns
      // Each gets 100/4 = 25%
      const result = calculateNewColumnWidth([30, 30, 40], 1);
      expect(result).toBeCloseTo(25);
    });

    it("should calculate width with default newColumnCount (1)", () => {
      // 2 existing columns + 1 default = 3 total columns
      // Each gets 100/3 ≈ 33.33%
      const result = calculateNewColumnWidth([50, 50]);
      expect(result).toBeCloseTo(33.33, 2);
    });

    it("should handle multiple new columns", () => {
      // 2 existing columns + 2 new = 4 total columns
      // Each gets 100/4 = 25%
      const result = calculateNewColumnWidth([50, 50], 2);
      expect(result).toBeCloseTo(25);
    });

    it("should handle no existing columns", () => {
      // 0 existing columns + 1 new = 1 total column
      // Gets 100/1 = 100%
      const result = calculateNewColumnWidth([], 1);
      expect(result).toBeCloseTo(100);
    });
  });
});