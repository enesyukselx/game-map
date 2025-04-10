import { describe, it, expect, vi } from "vitest";
import { drawVillagesOnMap } from "../drawVillagesOnMap";
import { calculateScreenPosition } from "../calculateScreenPosition";
import villageTypeColors from "../../data/villageTypeColors";
import { TVillage } from "../../types";

/*
    barbar: "black",
    ally: "blue",
    enemy: "red",
    unknown: "darkred",
*/

describe("drawVillagesOnMap", () => {
    it("should draw villages on the map", () => {
        //
        const ctx = {
            fillStyle: vi.fn(),
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "enemy",
                point: 1000,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 40 };

        const miniMapCenterCoords = { x: 100, y: 200 };
        const mapType = "MINI";
    });
});
