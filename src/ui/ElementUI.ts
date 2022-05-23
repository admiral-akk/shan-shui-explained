
export interface ParameterUI {
    SetVisibility(isVisible: boolean): void;

}
export abstract class ElementUI<ArgType> implements ParameterUI {
    private elements: HTMLElement[] = [];
    public args?: ArgType;

    SetVisibility(isVisible: boolean) {
        this.elements.forEach(element => element.style.display = isVisible ? 'block' : 'none');
    }

    constructor(private table: HTMLTableElement, protected changed: () => void) {
        this.InitializeTable();
        this.SetVisibility(false);
    }

    protected abstract InitializeTable(): void;

    protected AddRow(): HTMLTableRowElement {
        const row = document.createElement('tr');
        this.table.appendChild(row);
        this.elements.push(row);
        return row;
    }

    protected AddData(row: HTMLTableRowElement): HTMLTableCellElement {
        const data = document.createElement('td');
        row.appendChild(data);
        this.elements.push(data);
        return data;
    }

    protected AddInputBox(row: HTMLTableRowElement, initial: string, onChange: (newInput: string) => void) {
        const input = document.createElement('input');
        input.oninput = (ev: Event) => onChange(input.value);
        input.value = initial;
        this.elements.push(input);
        row.appendChild(input);
    }

    protected AddSlider(row: HTMLTableRowElement, initial: string, onChange: (newInput: string) => void) {
        const input = document.createElement('input');
        input.type = 'range';
        const intVal = parseFloat(initial);
        input.min = (intVal / 2).toString();
        input.max = (2 * intVal).toString();
        input.step = '0.1';
        input.value = initial;
        input.oninput = (ev: Event) => onChange(input.value);
        this.elements.push(input);
        row.appendChild(input);
    }

    protected AddArg(argName: string, argType: string, argVal: any, setArg: (val: any) => void) {
        switch (argType) {
            case 'number':
            case 'string':
                break;
            default:
                return;
        }
        const row = this.AddRow();
        const title = this.AddData(row);
        title.innerText = argName;
        const data = this.AddData(row);
        data.innerText = argVal;
        switch (argType) {
            case 'number':
                this.AddSlider(row, argVal, (val: string) => {
                    setArg(val);
                    data.innerText = val;
                    this.changed();
                })
                break;
            case 'string':
                this.AddInputBox(row, argVal, (val: string) => {
                    setArg(val);
                    data.innerText = val;
                    this.changed();
                })
                break;
            default:
                console.log(`unknown type: ${argName}, ${argType}`)
                break;
        }
    }
}