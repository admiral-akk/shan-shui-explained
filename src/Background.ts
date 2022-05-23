import { PerlinNoise } from "./noise/PerlinNoise";
import { Color } from "./struct/Color";

const RESOLUTION = 512;
export class Background {

    private background: HTMLElement = document.getElementById("BG_IMAGE")!;
    constructor(noise: PerlinNoise) {
        var canvas = document.getElementById("bgcanv") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d")!;

        for (var i = 0; i < RESOLUTION / 2 + 1; i++) {
            for (var j = 0; j < RESOLUTION / 2 + 1; j++) {
                const color = GetColor(noise, i, j);
                ctx.fillStyle = color.toString();

                // Image is mirrored along X/Y so that it smoothly tiles.
                ctx.fillRect(i, j, 1, 1);
                ctx.fillRect(RESOLUTION - i, j, 1, 1);
                ctx.fillRect(i, RESOLUTION - j, 1, 1);
                ctx.fillRect(RESOLUTION - i, RESOLUTION - j, 1, 1);
            }
        }
        var img = canvas.toDataURL("image/png");
        this.background.style.backgroundImage = "url(" + img + ")";
    }
}

function GetColor(noise: PerlinNoise, x: number, y: number): Color {
    // Base color.
    let c = 245;

    // Smooth noise to add some global pattern.
    c += noise.noise(x * 0.1, y * 0.1) * 10;

    // Random noise to add some graininess.
    c -= Math.random() * 20;

    // Magic numbers to give it more of a yellow tint.
    return new Color(c, (c * 0.95), (c * 0.85));
}