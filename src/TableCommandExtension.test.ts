import { Extension } from "@tiptap/core";
import { TableCommandExtension } from "./TableCommandExtension";
import duplicateColumn from "./commands/duplicateColumn";
import duplicateRow from "./commands/duplicateRow";

// Mock the utility functions that actually perform the table operations
jest.mock("./commands/duplicateColumn", () => {
  const mock = jest.fn((state, dispatch, withContent = true) => {
    // Simple mock that returns true as in the actual implementation
    return true;
  });
  return mock;
});

jest.mock("./commands/duplicateRow", () => {
  const mock = jest.fn((state, dispatch, withContent = true) => {
    // Simple mock that returns true as in the actual implementation
    return true;
  });
  return mock;
});

import { Editor } from "@tiptap/core";
import { EditorState, Transaction } from "@tiptap/pm/state";
import { EditorView } from "@tiptap/pm/view";

// Define a minimal CommandProps interface for the tests
interface MinimalCommandProps {
  state: EditorState;
  dispatch: ((args?: any) => any) | undefined;
  editor: Editor;
  tr: Transaction;
  commands: any;
  chain: any;
  can: any;
  view: EditorView;
}

describe("TableCommandExtension", () => {
  it("should be defined", () => {
    expect(TableCommandExtension).toBeDefined();
  });

  it("should have the correct name", () => {
    expect(TableCommandExtension.name).toBe("tableCommandExtension");
  });

  it("should be an instance of Extension", () => {
    expect(TableCommandExtension).toBeInstanceOf(Extension);
  });

  describe("addCommands", () => {
    it("should have addCommands method in config", () => {
      expect(TableCommandExtension.config.addCommands).toBeDefined();
      expect(typeof TableCommandExtension.config.addCommands).toBe("function");
    });

    it("should return an object with duplicateColumn and duplicateRow commands", () => {
      // Call addCommands in the proper context
      const commands = TableCommandExtension.config.addCommands!.call({
        name: TableCommandExtension.name,
        options: TableCommandExtension.options,
        storage: TableCommandExtension.storage,
        editor: null as any,
        parent: undefined, // Use undefined instead of null
      });

      expect(commands).toHaveProperty("duplicateColumn");
      expect(commands).toHaveProperty("duplicateRow");
      expect(typeof commands.duplicateColumn).toBe("function");
      expect(typeof commands.duplicateRow).toBe("function");
    });

    describe("duplicateColumn command", () => {
      it("should return a function that accepts withContent parameter", () => {
        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: null as any,
          parent: undefined,
        });

        const duplicateColumnFn = commands.duplicateColumn!;
        expect(typeof duplicateColumnFn).toBe("function");

        // Check that it returns a function when called without parameters
        const commandExecutor = duplicateColumnFn();
        expect(typeof commandExecutor).toBe("function");
      });

      it("should call the underlying duplicateColumn function with default value (true)", () => {
        const mockState = {} as EditorState;
        const mockDispatch = jest.fn();
        const mockEditor = {} as Editor;
        const mockTransaction = {} as Transaction;
        const mockView = {} as EditorView;

        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: mockEditor,
          parent: undefined,
        });

        const duplicateColumnFn = commands.duplicateColumn!;
        const commandExecutor = duplicateColumnFn(); // Gets the actual command function

        // Execute the command with state and dispatch
        const commandProps: MinimalCommandProps = {
          state: mockState,
          dispatch: mockDispatch,
          editor: mockEditor,
          tr: mockTransaction,
          commands: {},
          chain: jest.fn(),
          can: jest.fn(),
          view: mockView
        };
        const result = commandExecutor(commandProps);

        expect(duplicateColumn).toHaveBeenCalledWith(mockState, mockDispatch, true);
        expect(result).toBe(true);
      });

      it("should call the underlying duplicateColumn function with specified value", () => {
        const mockState = {} as EditorState;
        const mockDispatch = jest.fn();
        const mockEditor = {} as Editor;
        const mockTransaction = {} as Transaction;
        const mockView = {} as EditorView;

        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: mockEditor,
          parent: undefined,
        });

        const duplicateColumnFn = commands.duplicateColumn!;
        const commandExecutor = duplicateColumnFn(false); // Pass false as parameter

        // Execute the command with state and dispatch
        const commandProps: MinimalCommandProps = {
          state: mockState,
          dispatch: mockDispatch,
          editor: mockEditor,
          tr: mockTransaction,
          commands: {},
          chain: jest.fn(),
          can: jest.fn(),
          view: mockView
        };
        const result = commandExecutor(commandProps);

        expect(duplicateColumn).toHaveBeenCalledWith(mockState, mockDispatch, false);
        expect(result).toBe(true);
      });
    });

    describe("duplicateRow command", () => {
      it("should return a function that accepts withContent parameter", () => {
        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: null as any,
          parent: undefined,
        });

        const duplicateRowFn = commands.duplicateRow!;
        expect(typeof duplicateRowFn).toBe("function");

        // Check that it returns a function when called without parameters
        const commandExecutor = duplicateRowFn();
        expect(typeof commandExecutor).toBe("function");
      });

      it("should call the underlying duplicateRow function with default value (true)", () => {
        const mockState = {} as EditorState;
        const mockDispatch = jest.fn();
        const mockEditor = {} as Editor;
        const mockTransaction = {} as Transaction;
        const mockView = {} as EditorView;

        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: mockEditor,
          parent: undefined,
        });

        const duplicateRowFn = commands.duplicateRow!;
        const commandExecutor = duplicateRowFn(); // Gets the actual command function

        // Execute the command with state and dispatch
        const commandProps: MinimalCommandProps = {
          state: mockState,
          dispatch: mockDispatch,
          editor: mockEditor,
          tr: mockTransaction,
          commands: {},
          chain: jest.fn(),
          can: jest.fn(),
          view: mockView
        };
        const result = commandExecutor(commandProps);

        expect(duplicateRow).toHaveBeenCalledWith(mockState, mockDispatch, true);
        expect(result).toBe(true);
      });

      it("should call the underlying duplicateRow function with specified value", () => {
        const mockState = {} as EditorState;
        const mockDispatch = jest.fn();
        const mockEditor = {} as Editor;
        const mockTransaction = {} as Transaction;
        const mockView = {} as EditorView;

        const commands = TableCommandExtension.config.addCommands!.call({
          name: TableCommandExtension.name,
          options: TableCommandExtension.options,
          storage: TableCommandExtension.storage,
          editor: mockEditor,
          parent: undefined,
        });

        const duplicateRowFn = commands.duplicateRow!;
        const commandExecutor = duplicateRowFn(false); // Pass false as parameter

        // Execute the command with state and dispatch
        const commandProps: MinimalCommandProps = {
          state: mockState,
          dispatch: mockDispatch,
          editor: mockEditor,
          tr: mockTransaction,
          commands: {},
          chain: jest.fn(),
          can: jest.fn(),
          view: mockView
        };
        const result = commandExecutor(commandProps);

        expect(duplicateRow).toHaveBeenCalledWith(mockState, mockDispatch, false);
        expect(result).toBe(true);
      });
    });
  });
});