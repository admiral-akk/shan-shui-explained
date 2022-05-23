import { PerlinNoise } from "../noise/PerlinNoise";
import { Point } from "../geometry/Point";
import { poly } from "../Utils";
import { Args } from "./Args";

export class StrokeArgs {
    startPos: Point
    maxWidth: number;
    color: string;
    noiseStr: number;
    lineWidth: number;
    width: (x: number) => number;

    constructor(args: Args) {
        this.startPos = [args.xof ? args.xof! : 0, args.yof ? args.yof! : 0];
        this.maxWidth = args.wid ? args.wid! : 2;
        this.color = args.col ? args.col! : "rgba(200,200,200,0.9)";
        this.noiseStr = args.noi ? args.noi : 0.5;
        this.lineWidth = args.out ? args.out! : 0.5;
        this.width = args.fun ? args.fun! : (x: number) => Math.sin(x * Math.PI);
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

function loop(start: Point, leftPoints: Point[], end: Point, rightPoints: Point[]): Point[] {
    return [start].concat(leftPoints).concat([end]).concat(rightPoints.reverse()).concat([start])
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
        const width = args.maxWidth * args.width(i / ptlist.length);
        // The noise varies with how far along the curve we are.
        const noiseVal = noise.noise(i * 0.5, n0);
        const [leftPoint, rightPoint] = strokeSegment(width, args.noiseStr, noiseVal, ptlist[i - 1], ptlist[i], ptlist[i + 1]);
        leftCurve.push(leftPoint);
        rightCurve.push(rightPoint);
    }

    ccwPolygon = loop(ptlist[0], leftCurve, ptlist[ptlist.length - 1], rightCurve);

    var canv = poly(
        ccwPolygon,
        { xof: args.startPos[0], yof: args.startPos[1], fil: args.color, str: args.color, wid: args.lineWidth },
    );
    return canv;
}

export function stroke(ptlist: Point[], args: Args, noise: PerlinNoise): string {
    return privateStroke(ptlist, new StrokeArgs(args), noise);
}