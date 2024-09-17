import { columnIsHeader, addColSpan, tableNodeTypes } from '@tiptap/pm/tables'
export default function addDuplicateColumn(
    tr,
    { map, tableStart, table },
    col,
    withContent = true
) {
    let refColumn = col > 0 ? -1 : 0;
    if (columnIsHeader(map, table, col + refColumn)) {
        refColumn = col == 0 || col == map.width ? null : 0;
    }


    for (let row = 0; row < map.height; row++) {
        const index = row * map.width + col;
        // If this position falls inside a col-spanning cell
        if (col > 0 && col < map.width && map.map[index - 1] == map.map[index]) {
            const pos = map.map[index];
            const cell = table.nodeAt(pos);
            tr.setNodeMarkup(
                tr.mapping.map(tableStart + pos),
                null,
                addColSpan(cell.attrs, col - map.colCount(pos)),
            );
            // Skip ahead if rowspan > 1
            row += cell.attrs.rowspan - 1;
        } else {
            const _refColumn = refColumn == null ? null : table.nodeAt(map.map[index + refColumn]);
            const type =
                refColumn == null
                    ? tableNodeTypes(table.type.schema).cell
                    : table.nodeAt(map.map[index + refColumn]).type;
            const pos = map.positionAt(row, col, table);
            tr.insert(tr.mapping.map(tableStart + pos), _refColumn !== null ? (withContent ? type.create({ ..._refColumn.attrs }, _refColumn.content) : type.createAndFill({ ..._refColumn.attrs })) : type.createAndFill());
        }
    }
    return tr;
}