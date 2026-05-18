import TiptapTable from '@tiptap/extension-table'
import { TableCell as TableCellPlus } from '@tiptap/extension-table-cell'
import { TableHeader as TableHeaderPlus } from '@tiptap/extension-table-header'
import { TableRow as TableRowPlus } from '@tiptap/extension-table-row'
import TableCommandExtension from './TableCommandExtension';

export const TablePlus = TiptapTable.extend({
    addExtensions() {
        return [
            TableCommandExtension
        ]
    }
})

export const WithoutPagination = {
    TablePlus,
    TableCellPlus,
    TableHeaderPlus,
    TableRowPlus,
}
