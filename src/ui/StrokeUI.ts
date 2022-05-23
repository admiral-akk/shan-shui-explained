import { StrokeArgs } from "../brush/Stroke";
import { ElementUI } from "./ElementUI";


export class StrokeUI extends ElementUI<StrokeArgs> {
    protected InitializeTable() {
        this.args = new StrokeArgs();
        console.log(`Initializing Water UI`);
        Object.keys(this.args).forEach(key => {
            this.AddArg(key, typeof this.args![key as keyof StrokeArgs], (this.args as any)[key], (val: any) => { (this.args as any)[key] = val; })
        });
    }
}