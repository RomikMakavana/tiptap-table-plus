import Table from "@tiptap/extension-table";
import { mergeAttributes } from "@tiptap/core";
import { DOMOutputSpec } from "@tiptap/pm/model";
import { TableRowGroup } from "./TableRowGroup";
import { TableCommandExtension } from "../TableCommandExtension";
import { TablePlusNodeView } from "./TablePlusNodeView";
import { TablePlusOptions } from "./types";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReplaceStep } from "prosemirror-transform";
import { findParentNodeOfType, findParentNodeOfTypeAtPos, calculateNewColumnWidth, addColumns, isNodeAtRange, getColumnSizeList } from "../utilities/utils";
import { Node } from "@tiptap/pm/model";

export const TablePlus = Table.extend<TablePlusOptions>({
  content: "(tableRowGroup|tableRow)+",
  addOptions() {
    return {
      ...this.parent?.(),
      resizeHandleStyle: {
        background: "#353535",
      },
      minColumnSize: 50,
      borderColor: "black",
    };
  },
  addExtensions() {
    return [
      TableRowGroup,
      TableCommandExtension,
    ]
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      columnSize: {
        default: "",
        parseHTML: (element) => {
          let columnSize = element.getAttribute("data-column-size") || "";
          let columnSizeList = columnSize.split(",");
          const isAllNumber = columnSizeList.every(
            (a: string) => !isNaN(Number(a))
          );
          if (!isAllNumber) {
            columnSizeList = [];
          }
          return columnSizeList.join(",");
        },
        renderHTML: (attributes) => {
          return {
            "data-column-size": attributes.columnSize,
          };
        },
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const table: DOMOutputSpec = [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        border: 1,
      }),
      0,
    ];
    return table;
  },
  addNodeView() {
    return ({ node, getPos, editor }) =>
      new TablePlusNodeView(node, getPos, editor, this.options);
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("tablePlusPlugin"),
        appendTransaction: (transactions, oldState, newState) => {
          let tr = newState.tr;
          let isThereUpdate = false;
          let position = 0;
          let newStateTable: { start: number; node: Node }[] = [];
          transactions.forEach((transaction) => {
            if (transaction.steps.length > 0) {
              let tables: { start: number; node: Node }[] = [];
              // List all steps performed inside table
              const _steps = transaction.steps.filter((step) => {
                if (!(step instanceof ReplaceStep)) return false;
                let currentPosition =
                  step.slice.content.size - (step.to - step.from);
                position = position + currentPosition;
                // Check for is going to remove
                let _from = step.from - (position - currentPosition);
                let _to = step.to - (position - currentPosition);
                if(oldState.doc.content.size < _from || oldState.doc.content.size < _to || (_from < 0 || _to < 0)) return false;

                let _table = findParentNodeOfType(
                  oldState,
                  _from,
                  this.type
                );
                if (!_table) return false;

                let tableAlreadyExist = tables.find(
                  (table) => table.start === _table.start
                );
                if (!tableAlreadyExist) {
                  tables.push({ start: _table.start, node: _table.node });
                }

                // check all table cells are going to replace
                // Check for is going to add
                let isAdd = false;
                if (
                  step.slice.content &&
                  "content" in step.slice.content &&
                  step.slice.content.content &&
                  step.slice.content.content.length > 0
                ) {
                  isAdd = step.slice.content.content.every((node) =>
                    ["tableCell", "tableHeader"].includes(node.type.name)
                  );
                }
                if (isAdd) return true;

                let isRemove = isNodeAtRange(oldState, _from, _to, [
                  "tableCell",
                  "tableHeader",
                ]);

                if (isRemove) return true;

                return false;
              });

              if (_steps.length > 0 && tables.length == 1) {
                let position = 0;
                _steps.forEach((step) => {
                  if (!(step instanceof ReplaceStep)) return false;
                  let currentPosition =
                    step.slice.content.size - (step.to - step.from);
                  position = position + currentPosition;

                  // Check for is going to remove
                  let _from = step.from - (position - currentPosition);
                  let _to = step.to - (position - currentPosition);
                  
                  let _table = findParentNodeOfType(
                    oldState,
                    _from,
                    this.type
                  );
                  
                  let newStateTable = findParentNodeOfTypeAtPos(
                    step.from,
                    newState.doc,
                    this.type
                  );
                  
                  if (!_table || !newStateTable) return false;

                  let tableRow: {
                    from: number;
                    to: number;
                    node: Node | null;
                  } = {
                    from: 0,
                    to: 0,
                    node: null,
                  };
                  oldState.doc.nodesBetween(
                    _table.start,
                    _table.end,
                    (node, pos) => {
                      if (
                        node.type.name === "tableRow" &&
                        (tableRow.node == null ||
                          tableRow.node.childCount < node.childCount)
                      ) {
                        tableRow = {
                          from: pos,
                          to: pos + node.nodeSize,
                          node: node,
                        };
                        return true;
                      }
                    }
                  );
                  if (tableRow.node == null) return;
                  if (_from >= tableRow.from && _to <= tableRow.to) {
                    // get existing size list
                    let columnSize = getColumnSizeList(_table.node.attrs.columnSize);
                    let letCellList: {node: Node, from: number, to: number}[] = [];

                    oldState.doc.nodesBetween(
                      tableRow.from,
                      tableRow.to,
                      (node, pos) => {
                        if (
                          node.type.name === "tableCell" || node.type.name === "tableHeader"
                        ) {
                          letCellList.push({node: node, from: pos, to: (pos + node.nodeSize)});
                          return true;
                        }
                      }
                    );

                    if(letCellList.length == columnSize.length) {
                      let removeFromToIndex = { from: 0, count: 0 };

                      if(step.to > step.from) {
                        let removeCellIndex: number[] = [];

                        letCellList.forEach((cell, index) => {
                          if(cell.from >= step.from && cell.to <= step.to) {
                            removeCellIndex.push(index);
                          }
                        });

                        removeFromToIndex = { from: Math.min(...removeCellIndex), count: removeCellIndex.length };
                      }

                      let addNodes: Node[] = [];
                      if (
                        step.slice.content &&
                        "content" in step.slice.content &&
                        step.slice.content.content &&
                        step.slice.content.content.length > 0
                      ) {
                        addNodes = step.slice.content.content.filter((node) =>
                          ["tableCell", "tableHeader"].includes(node.type.name)
                        );
                      }
                      let columnAfterRemove = columnSize.slice(0, removeFromToIndex.from).concat(columnSize.slice(removeFromToIndex.from + removeFromToIndex.count));
                      
                      let newColumnWidth = addNodes.length > 0 ? Array(addNodes.length).fill(calculateNewColumnWidth(columnAfterRemove, addNodes.length)) : [];

                      let newColumnSize = addColumns(columnAfterRemove, newColumnWidth as number[]);

                      newState.doc.descendants((node, pos) => {
                        if (node.type.name === "table") {
                          if(newStateTable.pos === pos){
                            // Update/add an attribute
                            if (node.attrs.columnSize !== newColumnSize.join(",")) {
                              tr = tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                columnSize: newColumnSize.join(","),
                              });
                              isThereUpdate = true;
                            }
                          }
                        }
                      });
                    }else{
                      // Calculate totally new column size
                    }


                  }
                });
              }
            }
          });

          return isThereUpdate ? tr : null;
        },
      }),
    ];
  },
});

export default TablePlus;
