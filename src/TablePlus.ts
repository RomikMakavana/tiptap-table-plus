import { Table } from '@tiptap/extension-table'
import TableCommandExtension from './TableCommandExtension';

export const TablePlus = Table.extend({
    addExtensions() {
        return [
            TableCommandExtension
        ]
    }
})

export default TablePlus
