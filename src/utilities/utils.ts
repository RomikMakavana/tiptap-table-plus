import { EditorState } from "@tiptap/pm/state";
import { NodeType } from "@tiptap/pm/model";
export function getNodesAtPos(state: EditorState, pos: number) {
  const $pos = state.doc.resolve(pos);
  const nodes: { node: any; depth: number; start: number; end: number }[] = [];

  for (let depth = 0; depth <= $pos.depth; depth++) {
    const node = $pos.node(depth);
    nodes.push({
      node,
      depth,
      start: $pos.start(depth),
      end: $pos.end(depth),
    });
  }

  return nodes;
}

export function findParentNodeOfTypeAtPos(
  pos: number,
  doc: any,
  nodeType: NodeType
) {
  // Add validation to prevent out of range errors
  if (pos < 0 || pos > doc.content.size) {
    return null;
  }
  
  try {
    const $pos = doc.resolve(pos);

    for (let depth = $pos.depth; depth > 0; depth--) {
      const node = $pos.node(depth);
      if (node.type === nodeType) {
        return { node, pos: $pos.before(depth) };
      }
    }
  } catch (error) {
    // If resolve fails, return null
    return null;
  }
  
  return null;
}

export function findParentNodeOfType(
  state: EditorState,
  pos: number,
  nodeType: NodeType
) {
  const $pos = state.doc.resolve(pos);

  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);
    if (node.type === nodeType) {
      return {
        node,
        depth,
        start: $pos.start(depth),
        end: $pos.end(depth),
        pos: depth > 0 ? $pos.before(depth + 1) : 0,
      };
    }
  }

  return null;
}

export function isNodeAtRange(
  state: EditorState,
  from: number,
  to: number,
  nodeTypes: string[]
) {
  let found = false;

  state.doc.descendants((node, pos) => {
    if (!nodeTypes.includes(node.type.name)) return true;
    if (pos !== from) return true;
    if (pos + node.nodeSize !== to) return true;
    found = true;
    return false; // stop traversal early
  });

  return found;
}

export function getColumnSizeList(columnSize: string) {
  const arr: string[] = columnSize.split(",").map((str) => str.trim());

  const numbers: number[] = arr.every(
    (item) => item !== "" && !isNaN(Number(item))
  )
    ? arr.map(Number)
    : [];
  return numbers;
}

export function addColumns(widths: number[], newWidths: number[]): number[] {
  const totalExisting = widths.reduce((a, b) => a + b, 0);
  const totalNew = newWidths.reduce((a, b) => a + b, 0);
  const remaining = 100 - totalNew;

  if (remaining < 0) {
    throw new Error("New widths exceed 100%");
  }

  const scaled =
    totalExisting > 0 ? widths.map((w) => (w / totalExisting) * remaining) : [];

  return [...scaled, ...newWidths];
}

export function calculateNewColumnWidth(
  widths: number[],
  newColumnCount: number = 1
): number {
  const columns = widths.length + newColumnCount;
  return 100 / columns;
}
