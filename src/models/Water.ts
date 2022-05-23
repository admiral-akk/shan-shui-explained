import { PerlinNoise } from "../noise/PerlinNoise";
import { Point } from "../geometry/Point";
import { newStroke, stroke, StrokeArgs } from "../brush/Stroke";
import { Args } from "../brush/Args";

export class WaterArgs {
    hei: number;
    len: number;
    clu: number;
    stroke: StrokeArgs;

    constructor(args: Args = new Args()) {
        this.hei = args.hei ? args.hei : 2;
        this.len = args.len ? args.len : 800;
        this.clu = args.clu ? args.clu : 10;
        this.stroke = new StrokeArgs(args);
    }
}
export function newWater(xoff: number, yoff: number, Noise: PerlinNoise, args: WaterArgs = new WaterArgs()): string {
    var canv = "";

    var ptlist: Point[][] = [];
    var yk = 0;
    for (var i = 0; i < args.clu; i++) {
        ptlist.push([]);
        var xk = (Math.random() - 0.5) * (args.len / 8);
        yk += Math.random() * 5;
        var lk = args.len / 4 + Math.random() * (args.len / 4);
        var reso = 5;
        for (var j = -lk; j < lk; j += reso) {
            ptlist[ptlist.length - 1].push([
                j + xk,
                Math.sin(j * 0.2) * args.hei * Noise.noise(j * 0.1) - 20 + yk,
            ]);
        }
    }

    for (var j = 1; j < ptlist.length; j += 1) {
        const strokeArgs = args.stroke;
        strokeArgs.maxWidth = 1;
        strokeArgs.color = "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")";
        canv += newStroke(
            ptlist[j].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            strokeArgs,
            Noise
        );
    }

    return canv;
}

export function water(xoff: number, yoff: number, Noise: PerlinNoise, args: Args = new Args()): string {
    var hei = args.hei != undefined ? args.hei : 2;
    var len = args.len != undefined ? args.len : 800;
    var clu = args.clu != undefined ? args.clu : 10;
    var canv = "";

    var ptlist: Point[][] = [];
    var yk = 0;
    for (var i = 0; i < clu; i++) {
        ptlist.push([]);
        var xk = (Math.random() - 0.5) * (len / 8);
        yk += Math.random() * 5;
        var lk = len / 4 + Math.random() * (len / 4);
        var reso = 5;
        for (var j = -lk; j < lk; j += reso) {
            ptlist[ptlist.length - 1].push([
                j + xk,
                Math.sin(j * 0.2) * hei * Noise.noise(j * 0.1) - 20 + yk,
            ]);
        }
    }

    for (var j = 1; j < ptlist.length; j += 1) {
        canv += stroke(
            ptlist[j].map(function (x) {
                return [x[0] + xoff, x[1] + yoff];
            }),
            {
                col:
                    "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")",
                wid: 1,
            },
            Noise
        );
    }

    return canv;
}