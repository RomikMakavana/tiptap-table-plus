import duplicateRow from './duplicateRow';
import { isInTable, selectedRect } from '@tiptap/pm/tables';
import addDuplicateRow from '../utilities/addDuplicateRow';
import { EditorState, Transaction } from '@tiptap/pm/state';

// Mock the dependencies
jest.mock('@tiptap/pm/tables', () => ({
    isInTable: jest.fn(),
    selectedRect: jest.fn(),
}));

jest.mock('../utilities/addDuplicateRow', () => jest.fn());

describe('duplicateRow', () => {
    let mockState: jest.Mocked<EditorState>;
    let mockTr: jest.Mocked<Transaction>;
    let mockDispatch: jest.Mock;

    beforeEach(() => {
        mockTr = {
            insert: jest.fn().mockReturnThis(),
        } as any;

        mockState = {
            tr: mockTr,
        } as any;

        mockDispatch = jest.fn();

        // Reset mocks
        (isInTable as jest.Mock).mockReset();
        (selectedRect as jest.Mock).mockReset();
        (addDuplicateRow as jest.Mock).mockReset();
    });

    it('should return false when not in a table', () => {
        (isInTable as jest.Mock).mockReturnValue(false);

        const result = duplicateRow(mockState, mockDispatch);

        expect(result).toBe(false);
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should return true and call dispatch when in a table', () => {
        (isInTable as jest.Mock).mockReturnValue(true);
        
        const mockRect = { top: 0, bottom: 1, left: 0, right: 2 };
        (selectedRect as jest.Mock).mockReturnValue(mockRect);

        const mockTransaction = { insert: jest.fn() };
        (addDuplicateRow as jest.Mock).mockReturnValue(mockTransaction);

        const result = duplicateRow(mockState, mockDispatch);

        expect(result).toBe(true);
        expect(isInTable).toHaveBeenCalledWith(mockState);
        expect(selectedRect).toHaveBeenCalledWith(mockState);
        expect(addDuplicateRow).toHaveBeenCalledWith(
            mockState.tr,
            mockRect,
            mockRect.bottom,
            true // default withContent value
        );
        expect(mockDispatch).toHaveBeenCalledWith(mockTransaction);
    });

    it('should call dispatch with custom withContent parameter', () => {
        (isInTable as jest.Mock).mockReturnValue(true);
        
        const mockRect = { top: 0, bottom: 1, left: 0, right: 2 };
        (selectedRect as jest.Mock).mockReturnValue(mockRect);

        const mockTransaction = { insert: jest.fn() };
        (addDuplicateRow as jest.Mock).mockReturnValue(mockTransaction);

        duplicateRow(mockState, mockDispatch, false);

        expect(addDuplicateRow).toHaveBeenCalledWith(
            mockState.tr,
            mockRect,
            mockRect.bottom,
            false // withContent set to false
        );
        expect(mockDispatch).toHaveBeenCalledWith(mockTransaction);
    });

    it('should return true even when dispatch is undefined but in table', () => {
        (isInTable as jest.Mock).mockReturnValue(true);
        
        const result = duplicateRow(mockState, undefined);

        expect(result).toBe(true);
        expect(isInTable).toHaveBeenCalledWith(mockState);
        expect(selectedRect).not.toHaveBeenCalled(); // Should not be called when dispatch is undefined
    });

    it('should not call dispatch when dispatch is undefined', () => {
        (isInTable as jest.Mock).mockReturnValue(true);
        
        duplicateRow(mockState, undefined);

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});