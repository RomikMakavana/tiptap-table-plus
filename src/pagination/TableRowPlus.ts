import { TableRow } from "@tiptap/extension-table";

export const TableRowPlus = TableRow.extend({
    addNodeView() {
        return ({}) => {
          const dom = document.createElement('tr');
          dom.style.display = 'grid';
          dom.style.gridTemplateColumns = `var(--cell-percentage)`;
          dom.style.position = "relative";
          return {
            dom,
            contentDOM :  dom,
          };
        };
      },
})

export default TableRowPlus
