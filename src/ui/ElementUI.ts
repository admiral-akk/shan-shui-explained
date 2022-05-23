export abstract class ElementUI<ArgType> {
    private elements: HTMLElement[] = [];
    public args?: ArgType;

    SetVisibility(isVisible: boolean) {
        this.elements.forEach(element => element.hidden = isVisible);
    }

    constructor(private table: HTMLTableElement, protected changed: () => void) {
        this.InitializeTable();
    }

    protected abstract InitializeTable(): void;

    protected AddRow(): HTMLTableRowElement {
        const row = document.createElement('tr');
        this.table.appendChild(row);
        return row;
    }

    protected AddData(row: HTMLTableRowElement): HTMLTableCellElement {
        const data = document.createElement('td');
        row.appendChild(data);
        return data;
    }

    protected AddInputBox(row: HTMLTableRowElement, initial: string, onChange: (newInput: string) => void) {
        const input = document.createElement('input');
        input.oninput = (ev: Event) => onChange(input.value);
        input.value = initial;
        row.appendChild(input);
    }

    protected AddSlider(row: HTMLTableRowElement, initial: string, min: number, max: number, onChange: (newInput: string) => void) {
        const input = document.createElement('input');
        input.type = 'range';
        input.min = min.toString();
        input.max = max.toString();
        input.step = '0.1';
        input.value = initial;
        input.oninput = (ev: Event) => onChange(input.value);
        row.appendChild(input);
    }
}