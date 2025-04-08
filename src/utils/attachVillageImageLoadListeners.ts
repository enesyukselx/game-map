import villageImages from "../data/villageImages";
import { TVillage } from "../types";
import { drawVillagesOnMapWithImage } from "./drawVillagesOnMapWithImage";

let needsRedraw = false;

const throttleDraw = (
    ctx: CanvasRenderingContext2D,
    villages: TVillage[],
    coords: { x: number; y: number },
    mapConfig: { size: { width: number; height: number }; scale: number }
) => {
    if (!needsRedraw) {
        needsRedraw = true;
        requestAnimationFrame(() => {
            drawVillagesOnMapWithImage({
                ctx: ctx,
                villages,
                coords,
                mapType: "MAIN",
                mapConfig,
            });
            needsRedraw = false;
        });
    }
};

const attachVillageImageLoadListeners = (
    ctx: CanvasRenderingContext2D,
    villages: TVillage[],
    coords: { x: number; y: number },
    mapConfig: { size: { width: number; height: number }; scale: number }
) => {
    Object.values(villageImages).forEach(([normalImg, barbarImg]) => {
        [normalImg, barbarImg].forEach((img: HTMLImageElement) => {
            if (!img.complete) {
                img.onload = throttleDraw.bind(
                    null,
                    ctx,
                    villages,
                    coords,
                    mapConfig
                );
                img.onerror = throttleDraw.bind(
                    null,
                    ctx,
                    villages,
                    coords,
                    mapConfig
                );
            }
        });
    });
};

export default attachVillageImageLoadListeners;
