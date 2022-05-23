import { download } from "../Downloader";
import { Memory } from "../struct/Memory";
import { PerlinNoise } from "../noise/PerlinNoise";
import { Update } from "../Update";

import { Man } from "../models/Man";
import { Tree } from "../models/Tree";
import { newStroke } from "../brush/Stroke";
import { Point } from "../geometry/Point";
import { StrokeUI } from "../ui/StrokeUI";
import { ParameterUI } from "../ui/ElementUI";
import { WaterUI } from "../ui/WaterUI";
import { newWater } from "../models/Water";
enum ObjectTypes {
    Line,
    Water
}

export class UI {
    private t: ObjectTypes = ObjectTypes.Line;

    private points: Point[] = [];

    private UIs: Record<string, ParameterUI> = {
    };
    private addObject(x: number, y: number) {
        this.points.push([x, y]);
        this.updated();
    }

    constructor(private MEM: Memory, private update: Update, seed: string,
        private Noise: PerlinNoise, private man: Man, private tree: Tree) {
        window.addEventListener('click', (ev: MouseEvent) => {
            const target = ev.target as HTMLElement;
            if (!target || target.id !== "SVG") {
                return;
            }
            console.log(`clicked on ${ev.offsetX},${ev.offsetY}`);
            this.addObject(ev.offsetX, ev.offsetY);
        });

        MEM.lasttick = new Date().getTime();
        document
            .getElementById("BG")!
            .setAttribute("style", "width:" + MEM.windx + "px");
        update.update();
        document.body.scrollTo(0, 0);
        console.log(["SCROLLX", window.scrollX]);
        this.BuildBrushMenu();
        this.present();
    }



    xcroll(v: number) {
        this.MEM.cursx += v;
        if (this.update.needupdate()) {
            this.update.update();
        } else {
            this.update.viewupdate();
        }
    }
    autoxcroll(v: number) {
        if ((document.getElementById("AUTO_SCROLL") as HTMLInputElement).checked) {
            this.xcroll(v);
            setTimeout(() => this.autoxcroll(v), 2000);
        }
    }
    toggleText(id: string, a: string, b: string) {
        var v = document.getElementById(id)!.innerHTML;
        document.getElementById(id)!.innerHTML = v == "" || v == b ? a : b;
    }
    lastScrollX = 0;
    pFrame = 0;
    present() {
        var currScrollX = window.scrollX;
        var step = 1;
        //document.body.scrollTo(Math.max(0, this.pFrame - 10), window.scrollY);

        this.pFrame += step;

        //console.log([lastScrollX,currScrollX]);

        if (this.pFrame < 20 || Math.abs(this.lastScrollX - currScrollX) < step * 2) {
            this.lastScrollX = currScrollX;
            setTimeout(() => this.present(), 1);
        }
    }

    download() {
        download('' + (Math.random()) + '.svg', document.getElementById('BG')!.innerHTML);
    }
    btnHoverCol = "rgba(0,0,0,0.1)";

    private updated() {
        switch (this.t) {
            case ObjectTypes.Line:
                console.log('line');
                this.MEM.canv = newStroke(this.points, (this.UIs[ObjectTypes.Line] as StrokeUI).args!, this.Noise);
                break;
            case ObjectTypes.Water:
                console.log('water');
                this.MEM.canv = "";
                this.points.forEach(point => {
                    this.MEM.canv += newWater(point[0], point[1], this.Noise, (this.UIs[ObjectTypes.Water] as WaterUI).args!);
                });
                break;
        }
        console.log(`canvas now: ${this.MEM.canv}`);
        this.update.update();
    }

    private strokeUI?: StrokeUI;
    private BuildBrushMenu() {
        const table = document.createElement('table');
        document.getElementById("BRUSH_MENU")!.appendChild(table);
        addTypeSelector(table, (type: ObjectTypes) => {
            this.UIs[this.t].SetVisibility(false);
            this.t = type;
            this.UIs[this.t].SetVisibility(true);
            this.points = [];
        });
        this.UIs[ObjectTypes.Line] = new StrokeUI(table, () => this.updated());
        this.UIs[ObjectTypes.Water] = new WaterUI(table, () => this.updated());
        this.UIs[this.t].SetVisibility(true);
    }
}

function addTypeSelector(table: HTMLTableElement, setter: (type: ObjectTypes) => void) {
    const tr = addRowToTable(table);
    const td = addDataToRow(tr);
    const pre = document.createElement('pre');
    pre.innerText = "Drawing Type";
    td.appendChild(pre);

    const tr2 = addRowToTable(table);
    const td2 = addDataToRow(tr2);
    const input = document.createElement('select');

    input.onchange = (ev: Event) => {
        setter(parseInt(input.value));
    }
    Object.keys(ObjectTypes).filter((v) => isNaN(Number(v))).forEach((val: string, index: number) => {
        const enumVal = ObjectTypes[val as keyof typeof ObjectTypes];
        addOption(input, enumVal);
    });
    td2.appendChild(input);
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

function addOption(input: HTMLSelectElement, val: ObjectTypes) {
    const option = document.createElement('option');
    option.value = val.toString();
    option.innerText = ObjectTypes[val];
    input.appendChild(option);
}
