import { Point } from "../geometry/Point";


export class Args {
    len?: number;
    wid?: number;
    ang?: number;
    angs?: number[];
    col?: string;
    noi?: number;
    ret?: number;
    xof?: number;
    yof?: number;
    out?: number;
    tex?: number;
    sha?: number;
    fil?: string;
    veg?: boolean;
    str?: string;
    area?: number;
    convex?: boolean;
    optimize?: boolean;
    hei?: number;
    clu?: number;
    ben?: number;
    rot?: number;
    per?: number;
    tra?: boolean;
    bot?: boolean;
    wei?: number;
    pul?: Point;
    pur?: Point;
    pdl?: Point;
    pdr?: Point;
    hsp?: Point;
    vsp?: Point;
    seg?: number;
    fro?: boolean;
    cor?: number;
    pla?: [number, string];
    sid?: number;
    fli?: boolean;
    sca?: number;
    sto?: number;
    sty?: number;
    rai?: boolean;
    lens?: number[];
    cho?: number;
    det?: number;
    dir?: number;
    lea?: [boolean, number];

    fun?: (x: number) => number;
    dis?: () => number;
    color?: (x: number) => string;
    noise?: (x: number) => number;
    dec?: (x: any) => Point[][];
    ite?: (p1: Point, p2: Point, arg: any) => string;
    hat?: (p1: Point, p2: Point, arg: any) => string;
    bend?: (x: number) => number;
    constructor() { }
}

export class Tree01Args {
    hei?: number = 50;
    wid?: number = 3;
    noi?: number = 0.5;
    col?: string = "rgba(100,100,100,0.5)";
}
