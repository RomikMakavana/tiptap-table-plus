import { PaginationTable } from "./pagination";
import { WithoutPagination } from "./TablePlus";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
      tableCommandExtension: {
        duplicateColumn: (withContent?: boolean) => ReturnType;
        duplicateRow: (withContent?: boolean) => ReturnType;
      };
    }
  }
  
  const { TablePlus, TableCellPlus, TableHeaderPlus, TableRowPlus } = PaginationTable;

export { 
  WithoutPagination,
  TablePlus,
  TableCellPlus,
  TableHeaderPlus,
  TableRowPlus,
};
