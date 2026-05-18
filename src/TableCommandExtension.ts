import { Extension } from "@tiptap/core";
import duplicateColumn from "./commands/duplicateColumn";
import duplicateRow from "./commands/duplicateRow";

export const TableCommandExtension = Extension.create({
  name: "tableCommandExtension",

  addCommands() {
    return {
      duplicateColumn:
        (withContent = true) =>
        ({ state, dispatch }) => {
          duplicateColumn(state, dispatch, withContent);
          return true;
        },
      duplicateRow:
        (withContent = true) =>
        ({ state, dispatch }) => {
          duplicateRow(state, dispatch, withContent);
          return true;
        },
    };
  },
});
export default TableCommandExtension;
