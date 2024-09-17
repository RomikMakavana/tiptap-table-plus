import TiptapTable from '@tiptap/extension-table'
import duplicateColumn from './commands/duplicateColumn';
import duplicateRow from './commands/duplicateRow';

export const Table = TiptapTable.extend({
    addCommands() {
        return {
            ...this.parent?.(),
            duplicateColumn: (withContent = true) => ({ state, dispatch }) => {
                duplicateColumn(state, dispatch, withContent)
                return true;
            },
            duplicateRow: (withContent = true) => ({ state, dispatch }) => {
                duplicateRow(state, dispatch, withContent)
                return true;
            },
        }
    }
})

export default Table
