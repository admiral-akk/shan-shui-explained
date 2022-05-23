import { download } from "../Downloader";
import { Memory } from "../struct/Memory";
import { water } from "../models/Water";
import { PerlinNoise } from "../noise/PerlinNoise";
import { Update } from "../Update";

import { Man } from "../models/Man";
import { Tree } from "../models/Tree";
import { Args } from "../brush/Args";
import { stroke } from "../brush/Stroke";
import { Point } from "../geometry/Point";
enum ObjectTypes {
    None,
    Water,
    Man,
    Tree01,
    Line
}

export class UI {
    private t: ObjectTypes = ObjectTypes.None;

    private points: Point[] = [];
    private addObject(x: number, y: number, mem: Memory, noise: PerlinNoise) {

        switch (this.t) {
            case ObjectTypes.None:
                console.log('none'); return;
            case ObjectTypes.Line:
                console.log('none');
                this.points.push([x, y]);
                this.MEM.canv = stroke(this.points, {}, noise);
                break;
            case ObjectTypes.Water:
                console.log('water');
                this.MEM.canv += water(x, y, noise);
                break;
            case ObjectTypes.Man:
                console.log('man');
                this.MEM.canv += this.man.man(x, y);
                break;
            case ObjectTypes.Tree01:
                console.log('Tree01');
                this.MEM.canv += this.tree.tree01(x, y);
                break;
        }
        console.log(`canvas now: ${this.MEM.canv}`);
        this.update.update();

    }
    constructor(private MEM: Memory, private update: Update, seed: string,
        Noise: PerlinNoise, private man: Man, private tree: Tree) {
        window.addEventListener('click', (ev: MouseEvent) => {
            const target = ev.target as HTMLElement;
            if (!target || target.id !== "SVG") {
                return;
            }
            console.log(`clicked on ${ev.pageX},${ev.pageY}`);
            this.addObject(ev.pageX, ev.pageY, this.MEM, Noise);
        });

        MEM.lasttick = new Date().getTime();
        (document.getElementById("INP_SEED") as HTMLInputElement).value = seed;
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
    toggleVisible(id: string) {
        var v = document.getElementById(id)!.style.display == "none";
        document.getElementById(id)!.style.display = v ? "block" : "none";
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
    reloadWSeed(s: string) {
        var u = window.location.href.split("?")[0];
        window.location.href = u + "?seed=" + s;
        //window.location.reload(true)
    }

    download() {
        download('' + (Math.random()) + '.svg', document.getElementById('BG')!.innerHTML);
    }
    btnHoverCol = "rgba(0,0,0,0.1)";

    private BuildBrushMenu() {
        const table = document.createElement('table');
        document.getElementById("BRUSH_MENU")!.appendChild(table);

        const args = new Args();

        args.ang = 10;

        Object.keys(args).forEach(arg => { console.log(`arg: ${arg}`) })

        const tr = addRowToTable(table);
        const td = addDataToRow(tr);
        const pre = document.createElement('pre');
        pre.innerText = "HELLO WORLD";
        td.appendChild(pre);

        const tr2 = addRowToTable(table);
        const td2 = addDataToRow(tr2);
        const input = document.createElement('select');

        input.onchange = (ev: Event) => {
            console.log(`raw key: ${input.value}`);
            console.log(`key: ${input.value as keyof typeof ObjectTypes}`);
            this.t = parseInt(input.value);
            console.log(`Type is now: ${this.t}, ${ObjectTypes[this.t]}`)
        }
        Object.keys(ObjectTypes).filter((v) => isNaN(Number(v))).forEach((val: string, index: number) => {
            const enumVal = ObjectTypes[val as keyof typeof ObjectTypes];
            addOption(input, enumVal);

        });
        td2.appendChild(input);

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

function addOption(input: HTMLSelectElement, val: ObjectTypes) {
    const option = document.createElement('option');
    option.value = val.toString();
    option.innerText = ObjectTypes[val];
    input.appendChild(option);
}
