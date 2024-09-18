
# Tiptap Table Plus
[![NPM](https://img.shields.io/npm/v/tiptap-table-plus.svg)](https://www.npmjs.com/package/tiptap-table-plus)

`tiptap-table-plus` is an npm package that extends the table functionality of the Tiptap editor by adding two new commands: `duplicateColumn` and `duplicateRow`.

## Installation

To install the package, use npm:

```bash
npm install tiptap-table-plus
```

# Commands
## `duplicateColumn`

This command duplicates the current column. By default, it copies the content of the column as well.

### Usage
```
editor.commands.duplicateColumn(true);
```

### Parameters
- `withContent` (boolean): 
- If true, the content of the column will be copied. If false, only the structure will be duplicated. Default is true.

## `duplicateRow`

This command duplicates the current row. By default, it copies the content of the row as well.
### Usage
```
editor.commands.duplicateRow(true);
```

### Parameters
- `withContent` (boolean): 
- If true, the content of the row will be copied. If false, only the structure will be duplicated. Default is true.

# Example
Here is an example of how to use these commands in your Tiptap editor setup:
```
import { Editor } from '@tiptap/core';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TiptapTablePlus from 'tiptap-table-plus';

const editor = new Editor({
  extensions: [
    Table,
    TableRow,
    TableCell,
    TableHeader,
    TiptapTablePlus,
  ],
  content: '<p>Hello World!</p>',
});

// Duplicate the current column with content
editor.commands.duplicateColumn(false);

// Duplicate the current row without content
editor.commands.duplicateRow(false);
```

# License
This package is open-sourced software licensed under the MIT license.

