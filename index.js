import TiptapTable from '@tiptap/extension-table'
import duplicateColumn from './commands/duplicateColumn';
import duplicateRow from './commands/duplicateRow';

export const Table = TiptapTable.extend({
    addCommands() {
        return {
            ...this.parent?.(),
            duplicateColumn: () => ({ state, dispatch }) => {
                duplicateColumn(state, dispatch)
                return true;
            },
            duplicateRow: () => ({ state, dispatch }) => {
                duplicateRow(state, dispatch)
                return true;
            },
        }
    }
})

export default Table
