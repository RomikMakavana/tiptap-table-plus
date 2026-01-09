import { Table, TableKit, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import TableCommandExtension from './TableCommandExtension';

export const TablePlus = Table.extend({
    addExtensions() {
        return [
            TableCommandExtension
        ]
    }
});

export const TableKitPlus = TableKit.extend({
    addExtensions() {
      const extensions = []
  
      if (this.options.table !== false) {
        extensions.push(TablePlus.configure(this.options.table))
      }
  
      if (this.options.tableCell !== false) {
        extensions.push(TableCell.configure(this.options.tableCell))
      }
  
      if (this.options.tableHeader !== false) {
        extensions.push(TableHeader.configure(this.options.tableHeader))
      }
  
      if (this.options.tableRow !== false) {
        extensions.push(TableRow.configure(this.options.tableRow))
      }
  
      return extensions
    },
})

export const TableCellPlus = TableCell;
export const TableHeaderPlus = TableHeader;
export const TableRowPlus = TableRow;


export const WithoutPagination = {
    TablePlus,
    TableKitPlus,
    TableCellPlus,
    TableHeaderPlus,
    TableRowPlus
}
