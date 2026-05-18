import esbuild from "esbuild";

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

// ESM bundle
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/index.js",
  external,
  sourcemap: false,
});

// CJS bundle for legacy consumers
await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  format: "cjs",
  outfile: "dist/index.cjs",
  external,
  sourcemap: false,
});

console.log("Build complete.");
