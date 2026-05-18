import { isInTable, selectedRect } from "@tiptap/pm/tables";
import addDuplicateRow from "../utilities/addDuplicateRow";
import { EditorState } from "@tiptap/pm/state";

const duplicateRow = (state: EditorState, dispatch: ((args?: any) => any) | undefined, withContent = true) => {
    if (!isInTable(state)) return false;
    if (dispatch) {
        const rect = selectedRect(state);
        dispatch(addDuplicateRow(state.tr, rect, rect.bottom, withContent));
    }
    return true;
}

export default duplicateRow;