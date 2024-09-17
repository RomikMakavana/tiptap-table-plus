import { rowIsHeader, tableNodeTypes } from "@tiptap/pm/tables";
export default function addDuplicateRow(
    tr,
    { map, tableStart, table },
    row,
    withContent = true
) {
    let rowPos = tableStart;
    for (let i = 0; i < row; i++) rowPos += table.child(i).nodeSize;
    const cells = [];
    let refRow = row > 0 ? -1 : 0;
    if (rowIsHeader(map, table, row + refRow))
        refRow = row == 0 || row == map.height ? null : 0;
    for (let col = 0, index = map.width * row; col < map.width; col++, index++) {
        // Covered by a rowspan cell
        if (
            row > 0 &&
            row < map.height &&
            map.map[index] == map.map[index - map.width]
        ) {
            const pos = map.map[index];
            const attrs = table.nodeAt(pos).attrs;
            tr.setNodeMarkup(tableStart + pos, null, {
                ...attrs,
                rowspan: attrs.rowspan + 1,
            });
            col += attrs.colspan - 1;
        } else {
            const _refRow = !Array.isArray(map.map) || refRow == null || !((index + refRow * map.width) in map.map) ? null : table.nodeAt(map.map[index + refRow * map.width]);

            const type =
                refRow == null
                    ? tableNodeTypes(table.type.schema).cell
                    : table.nodeAt(map.map[index + refRow * map.width])?.type;
            const node = _refRow !== null ? type?.create({ ..._refRow.attrs }, withContent ? _refRow.content : false) : type?.createAndFill();
            if (node) cells.push(node);
        }
    }
    tr.insert(rowPos, tableNodeTypes(table.type.schema).row.create(null, cells));
    return tr;
}