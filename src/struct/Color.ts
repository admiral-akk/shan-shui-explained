export class Color {
    constructor(private r?: number,
        private g?: number,
        private b?: number,
        private a?: number) { }

    toString(): string {
        if (!this.r || !this.b || !this.g) {
            return `none`;
        }
        if (!this.a) {
            return `rgba(${this.r},${this.g},${this.b})`;
        }
        return `rgba(${this.r!.toFixed(0)},${this.g.toFixed(0)},${this.b.toFixed(0)}` + ((this.a) ? `,${this.a.toFixed(0)}` : ``) + `)`;
    }
}