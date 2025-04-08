import terrainImages from "../data/terrainImages";
import { TTerrain } from "../types";
import { drawTerrainsOnMap } from "./drawTerrainsOnMap";

let needsRedraw = false;

const throttleDraw = (
    ctx: CanvasRenderingContext2D,
    terrains: TTerrain[],
    coords: { x: number; y: number },
    mapConfig: { size: { width: number; height: number }; scale: number }
) => {
    if (!needsRedraw) {
        needsRedraw = true;
        requestAnimationFrame(() => {
            drawTerrainsOnMap({
                ctx: ctx,
                terrains,
                coords,
                mapConfig,
            });
            needsRedraw = false;
        });
    }
};

const attachTerrainImageLoadListeners = (
    ctx: CanvasRenderingContext2D,
    terrains: TTerrain[],
    coords: { x: number; y: number },
    mapConfig: { size: { width: number; height: number }; scale: number }
) => {
    Object.values(terrainImages).forEach((img: HTMLImageElement) => {
        if (!img.complete) {
            img.onload = throttleDraw.bind(
                null,
                ctx,
                terrains,
                coords,
                mapConfig
            );
            img.onerror = throttleDraw.bind(
                null,
                ctx,
                terrains,
                coords,
                mapConfig
            );
        }
    });
};

export default attachTerrainImageLoadListeners;
