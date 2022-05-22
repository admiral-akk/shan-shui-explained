export class Args {
    len?: number;
    wid?: number;
    ang?: number;
    col?: string;
    noi?: number;
    ret?: number;
    xof?: number;
    yof?: number;
    out?: number;
    tex?: number;
    sha?: number;
    fil?: string;
    str?: string;
    area?: number;
    convex?: boolean;
    optimize?: boolean;
    fun?: (x: number) => number;
    dis?: () => number;
    color?: (x: number) => string;
    noise?: (x: number) => number;
    constructor() { }
}