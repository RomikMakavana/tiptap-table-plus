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

  const  { TablePlus, TableKitPlus, TableCellPlus, TableHeaderPlus, TableRowPlus } = PaginationTable;

export { 
  WithoutPagination,
  TablePlus,
  TableKitPlus,
  TableCellPlus,
  TableHeaderPlus,
  TableRowPlus,
};
