import { Tree01Args } from "../brush/Args";

export abstract class ElementUI {
    constructor(protected table: HTMLTableElement) {
    }
}
export class Tree01 extends ElementUI {
    private args: Tree01Args = new Tree01Args();
    constructor(table: HTMLTableElement) {
        super(table);
    }

    private InitializeTable() {

    }
}

function addRowToTable(table: HTMLTableElement): HTMLTableRowElement {
    const tr = document.createElement('tr');
    table.appendChild(tr);
    return tr;
}

function addDataToRow(row: HTMLTableRowElement): HTMLTableCellElement {
    const td = document.createElement('td');
    row.appendChild(td);
    return td;
}