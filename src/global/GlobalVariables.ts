import { UniformRNG } from "./UniformRNG";
import { UI } from "./UI";

declare global {
    interface Window {
        UI: UI;
    }
}

export function InitializeGlobalVariables(rng: UniformRNG, ui: UI) {
    window.UI = ui;
    Math.random = () => rng.next();
}