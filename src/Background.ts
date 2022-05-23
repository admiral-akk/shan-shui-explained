import { PerlinNoise } from "./noise/PerlinNoise";
import { Color } from "./struct/Color";

export class BackgroundArgs {
    resolution = 512;
    baseColor = 245;
    noiseScale = 0.1;
    noiseMagnitude = 10;
    localNoiseMagnitude = 20;
    redScale = 1;
    greenScale = 0.95;
    blueScale = 0.85;
}

export class Background {
    private background: HTMLElement = document.getElementById("BG_IMAGE")!;
    private args: BackgroundArgs = new BackgroundArgs();
    constructor(noise: PerlinNoise) {
        var canvas = document.getElementById("bgcanv") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d")!;
        const resolution = this.args.resolution;

        for (var i = 0; i < resolution / 2 + 1; i++) {
            for (var j = 0; j < resolution / 2 + 1; j++) {
                const color = this.GetColor(noise, i, j);
                ctx.fillStyle = color.toString();

                // Image is mirrored along X/Y so that it smoothly tiles.
                ctx.fillRect(i, j, 1, 1);
                ctx.fillRect(resolution - i, j, 1, 1);
                ctx.fillRect(i, resolution - j, 1, 1);
                ctx.fillRect(resolution - i, resolution - j, 1, 1);
            }
        }
        var img = canvas.toDataURL("image/png");
        this.background.style.backgroundImage = "url(" + img + ")";
    }

    private GetColor(noise: PerlinNoise, x: number, y: number): Color {
        // Base color.
        let c = this.args.baseColor;

        // Smooth noise to add some global pattern.
        c += noise.noise(x * this.args.noiseScale, y * this.args.noiseScale) * this.args.noiseMagnitude;

        // Random noise to add some graininess.
        c -= Math.random() * this.args.localNoiseMagnitude;

        // Magic numbers to give it more of a yellow tint.
        return new Color(c * this.args.redScale, c * this.args.greenScale, c * this.args.blueScale);
    }
}