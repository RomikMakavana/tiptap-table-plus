import { isInTable, selectedRect } from "@tiptap/pm/tables";
import addDuplicateRow from "../utilities/addDuplicateRow";

const duplicateRow = (state, dispatch) => {
    if (!isInTable(state)) return false;
    if (dispatch) {
        const rect = selectedRect(state);
        dispatch(addDuplicateRow(state.tr, rect, rect.bottom));
    }
    return true;
}

export default duplicateRow;