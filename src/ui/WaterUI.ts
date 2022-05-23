import { WaterArgs } from "../models/Water";
import { ElementUI } from "./ElementUI";

export class WaterUI extends ElementUI<WaterArgs> {
    protected InitializeTable() {
        this.args = new WaterArgs();
        console.log(`Initializing Stroke UI`);
        Object.keys(this.args).forEach(key => {
            this.AddArg(key, typeof this.args![key as keyof WaterArgs], (this.args as any)[key], (val: any) => { (this.args as any)[key] = val; })
        });
    }
}