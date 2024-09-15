import TiptapTable from '@tiptap/extension-table'
import duplicateColumn from './commands/duplicateColumn';

export const Table = TiptapTable.extend({
    addCommands() {
        return {
            ...this.parent?.(),
            duplicateColumn: () => ({ state, dispatch }) => {
                duplicateColumn(state, dispatch)
                return true;
            },
        }
    }
})

export default Table
