import { build } from "rolldown";

const external = [
  "@tiptap/core",
  "@tiptap/extension-table",
  "@tiptap/extension-table-cell",
  "@tiptap/extension-table-header",
  "@tiptap/extension-table-row",
  "@tiptap/pm",
  "@tiptap/pm/model",
  "@tiptap/pm/state",
  "@tiptap/pm/tables",
  "prosemirror-transform",
];

await build({
  input: "src/index.ts",
  external,
  output: { file: "dist/index.js", format: "esm" },
});

await build({
  input: "src/index.ts",
  external,
  output: { file: "dist/index.cjs", format: "cjs" },
});

console.log("Build complete.");
