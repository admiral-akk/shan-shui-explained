export class Color {
    constructor(private r: number,
        private g: number,
        private b: number,
        private a: number) { }

    toString(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
}