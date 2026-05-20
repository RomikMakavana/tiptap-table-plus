import { TableRowGroup, getMaximumRowSpan, getRowGroupList, mergeOverlappingGroups } from "./TableRowGroup";
import { Schema } from "@tiptap/pm/model";

// Mock @tiptap packages for testing
const mockSchema = {
  nodes: {
    tableRowGroup: {
      createAndFill: jest.fn()
    },
    table: {
      createAndFill: jest.fn()
    }
  }
};

const mockEditor = {
  schema: mockSchema
};

describe("TableRowGroup", () => {
  it("should be defined", () => {
    expect(TableRowGroup).toBeDefined();
  });

  it("should have a name property", () => {
    expect(TableRowGroup).toHaveProperty("name");
  });
});

describe("getMaximumRowSpan", () => {
  it("should return 0 for a row with no cells", () => {
    // Mock a ProseMirrorNode with no children
    const mockRow = {
      forEach: jest.fn((callback) => {
        // Don't call callback since there are no children
      }),
      attrs: {}
    };

    const result = getMaximumRowSpan(mockRow as any);

    expect(result).toBe(0);
  });

  it("should return the maximum rowspan value in a row", () => {
    const mockCell1 = { attrs: { rowspan: 1 } };
    const mockCell2 = { attrs: { rowspan: 3 } };
    const mockCell3 = { attrs: { rowspan: 2 } };

    const mockRow = {
      forEach: jest.fn((callback) => {
        callback(mockCell1, 0, 0);
        callback(mockCell2, 1, 1);
        callback(mockCell3, 2, 2);
      }),
      attrs: {}
    };

    const result = getMaximumRowSpan(mockRow as any);

    expect(result).toBe(3);
  });

  it("should handle cells without rowspan attribute", () => {
    const mockCell1 = { attrs: {} }; // No rowspan attribute
    const mockCell2 = { attrs: { rowspan: 2 } };

    const mockRow = {
      forEach: jest.fn((callback) => {
        callback(mockCell1, 0, 0);
        callback(mockCell2, 1, 1);
      }),
      attrs: {}
    };

    const result = getMaximumRowSpan(mockRow as any);

    expect(result).toBe(2);
  });

  it("should return 1 when all cells have default rowspan", () => {
    const mockCell1 = { attrs: { rowspan: 1 } };
    const mockCell2 = { attrs: { rowspan: 1 } };

    const mockRow = {
      forEach: jest.fn((callback) => {
        callback(mockCell1, 0, 0);
        callback(mockCell2, 1, 1);
      }),
      attrs: {}
    };

    const result = getMaximumRowSpan(mockRow as any);

    expect(result).toBe(1);
  });
});

describe("getRowGroupList", () => {
  it("should return correct row grouping for single rows", () => {
    const result = getRowGroupList(3, { 1: 1, 2: 1, 3: 1 });
    
    expect(result).toEqual([[1], [2], [3]]);
  });

  it("should return correct row grouping with spans", () => {
    const result = getRowGroupList(4, { 1: 2, 2: 1, 3: 1, 4: 1 }); // Row 1 has rowspan of 2
    
    // Row 1 spans into row 2, so group [1,2], then [2], [3], [4]
    expect(result).toEqual([[1, 2], [2], [3], [4]]);
  });

  it("should handle various rowspan values", () => {
    const result = getRowGroupList(5, { 1: 3, 2: 1, 3: 1, 4: 2, 5: 1 }); // Row 1 spans 3 rows, row 4 spans 2
    
    expect(result).toEqual([[1, 2, 3], [2], [3], [4, 5], [5]]);
  });

  it("should work with empty rowSpanList", () => {
    const result = getRowGroupList(3, {});
    
    expect(result).toEqual([[1], [2], [3]]);
  });
});

describe("mergeOverlappingGroups", () => {
  it("should return the same groups when there are no overlaps", () => {
    const input = [[1], [2], [3]];
    const result = mergeOverlappingGroups(input);
    
    expect(result).toEqual([[1], [2], [3]]);
  });

  it("should merge overlapping groups", () => {
    const input = [[1, 2], [2, 3], [4]]; // [1,2] and [2,3] overlap at index 2
    const result = mergeOverlappingGroups(input);
    
    // Should merge [1,2] and [2,3] into [1,2,3], keeping [4] as is
    expect(result).toEqual([[1, 2, 3], [4]]);
  });

  it("should merge multiple overlapping groups", () => {
    const input = [[1, 2], [2, 3], [3, 4]]; // All three groups overlap
    const result = mergeOverlappingGroups(input);
    
    expect(result).toEqual([[1, 2, 3, 4]]);
  });

  it("should handle complex overlapping scenario", () => {
    const input = [[1, 2, 3], [2, 3, 4], [4, 5, 6], [6, 7]];
    const result = mergeOverlappingGroups(input);
    
    expect(result).toEqual([[1, 2, 3, 4, 5, 6, 7]]);
  });

  it("should sort elements within each group", () => {
    const input = [[3, 1, 2], [4, 6, 5]];
    const result = mergeOverlappingGroups(input);
    
    expect(result).toEqual([[1, 2, 3], [4, 5, 6]]);
  });

  it("should handle duplicate elements in the same group", () => {
    const input = [[1, 1, 2], [2, 3, 3]];
    const result = mergeOverlappingGroups(input);
    
    expect(result).toEqual([[1, 2, 3]]);
  });
});