import { PerlinNoise } from "../noise/PerlinNoise";
import { Point } from "../geometry/Point";
import { poly } from "../Utils";
import { Args } from "./Args";

export class StrokeArgs {
    xof: number;
    yof: number;
    wid: number;
    col: string;
    noi: number;
    out: number;
    fun: (x: number) => number;

    constructor(args: Args) {
        this.xof = args.xof ? args.xof! : 0;
        this.yof = args.yof ? args.yof! : 0;
        this.wid = args.wid ? args.wid! : 2;
        this.col = args.col ? args.col! : "rgba(200,200,200,0.9)";
        this.noi = args.noi ? args.noi : 0.5;
        this.out = args.out ? args.out! : 0.5;
        this.fun = args.fun ? args.fun! : (x: number) => Math.sin(x * Math.PI);
    }
}

function strokeSegment(width: number, noiseMagnitude: number, noiseVal: number,
    prevPoint: Point, currPoint: Point, nextPoint: Point): [Point, Point] {

    // Vary the width.
    width = width * (1 - noiseMagnitude) + width * noiseMagnitude * noiseVal;

    // Estimate the angle tangent to the curve at this point.
    var a1 = Math.atan2(
        currPoint[1] - prevPoint[1],
        currPoint[0] - prevPoint[0],
    );
    var a2 = Math.atan2(
        currPoint[1] - nextPoint[1],
        currPoint[0] - nextPoint[0],
    );

    // Estimate the angle tangent to the curve at this point.
    var a = (a1 + a2) / 2;
    if (a < a2) {
        a += Math.PI;
    }
    return [
        [currPoint[0] + width * Math.cos(a), currPoint[1] + width * Math.sin(a)],
        [currPoint[0] - width * Math.cos(a), currPoint[1] - width * Math.sin(a)]
    ];
}

function privateStroke(ptlist: Point[], args: StrokeArgs, noise: PerlinNoise): string {

    if (ptlist.length == 0) {
        return "";
    }
    let leftCurve: Point[] = [];
    let rightCurve: Point[] = [];
    let ccwPolygon: Point[] = [];
    var n0 = Math.random() * 10;
    for (var i = 1; i < ptlist.length - 1; i++) {
        const width = args.wid * args.fun(i / ptlist.length);
        // The noise varies with how far along the curve we are.
        const noiseVal = noise.noise(i * 0.5, n0);
        const [leftPoint, rightPoint] = strokeSegment(width, args.noi, noiseVal, ptlist[i - 1], ptlist[i], ptlist[i + 1]);
        leftCurve.push(leftPoint);
        rightCurve.push(rightPoint);
    }

    ccwPolygon = loop(ptlist[0], ptlist[ptlist.length - 1], leftCurve, rightCurve);

    var canv = poly(
        ccwPolygon.map(function (x) {
            return [x[0] + args.xof, x[1] + args.yof];
        }),
        { fil: args.col, str: args.col, wid: args.out },
    );
    return canv;

}

function loop(start: Point, end: Point, leftPoints: Point[], rightPoints: Point[]): Point[] {
    return [start].concat(leftPoints).concat([end]).concat(rightPoints.reverse()).concat([start])
}

export function stroke(ptlist: Point[], args: Args, noise: PerlinNoise): string {
    return privateStroke(ptlist, new StrokeArgs(args), noise);
}