import { download } from "../Downloader";
import { Memory } from "../Memory";
import { Update } from "../Update";

export class UI {
    constructor(private MEM: Memory, private update: Update, seed: string) {
        window.addEventListener("scroll", (e: Event) => {
            document.getElementById("SETTING")!.style.left = Math.max(
                4,
                40 - window.scrollX
            ) + "px";
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
        document.body.scrollTo(Math.max(0, this.pFrame - 10), window.scrollY);

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



        const tr = addRowToTable(table);
        const td = addDataToRow(tr);
        const pre = document.createElement('pre');
        pre.innerText = "HELLO WORLD";
        td.appendChild(pre);


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
