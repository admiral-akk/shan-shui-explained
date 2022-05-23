import { StrokeArgs } from "../brush/Stroke";
import { ElementUI } from "./ElementUI";


export class StrokeUI extends ElementUI<StrokeArgs> {
    protected InitializeTable() {
        this.args = new StrokeArgs();
        console.log(`Initializing Stroke UI`);
        Object.keys(this.args).forEach(key => {
            const row = this.AddRow();
            const title = this.AddData(row);
            title.innerText = key;
            const type = typeof this.args![key as keyof StrokeArgs];
            const val = (this.args as any)[key];
            const data = this.AddData(row);
            data.innerText = (this.args as any)[key];
            switch (type) {
                case 'number':
                    this.AddSlider(row, val, 0, 5, (val: string) => {
                        (this.args as any)[key] = parseFloat(val);
                        data.innerText = (this.args as any)[key];
                        this.changed();
                    })
                    break;
                case 'string':
                    this.AddInputBox(row, val, (val: string) => {
                        (this.args as any)[key] = val;
                        data.innerText = (this.args as any)[key];
                        this.changed();
                    })
                    break;
                default:
                    console.log(`unknown type: ${key}, ${type}`)
                    break;
            }
        });
    }
}