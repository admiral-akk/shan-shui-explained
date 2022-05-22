import { UI } from "./UI";

declare global {
    interface Window {
        UI: UI;
    }
}

export function InitializeGlobalVariables(ui: UI) {
    window.UI = ui;
}