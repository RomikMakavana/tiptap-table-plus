import { TableKit, TableKitOptions } from "@tiptap/extension-table"
import { TablePlus } from "./TablePlus"
import { TableCellPlus } from "./TableCellPlus"
import { TableHeaderPlus } from "./TableHeaderPlus"
import { TableRowPlus } from "./TableRowPlus"

export const TableKitPlus = TableKit.extend<TableKitOptions>({
    addExtensions() {
      const extensions = []
  
      if (this.options.table !== false) {
        extensions.push(TablePlus.configure(this.options.table))
      }
  
      if (this.options.tableCell !== false) {
        extensions.push(TableCellPlus.configure(this.options.tableCell))
      }
  
      if (this.options.tableHeader !== false) {
        extensions.push(TableHeaderPlus.configure(this.options.tableHeader))
      }
  
      if (this.options.tableRow !== false) {
        extensions.push(TableRowPlus.configure(this.options.tableRow))
      }
  
      return extensions
    },
})