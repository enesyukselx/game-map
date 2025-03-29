import villageTypeColors from "../data/villageTypeColors";
import { TVillage } from "../types";
import { calculateScreenPosition } from "./calculateScreenPosition";

export const drawVillagesOnMap = ({
    ctx,
    villages,
    coords,
    mapType,
    miniMapCenterCoords,
    mapConfig,
}: {
    ctx: CanvasRenderingContext2D;
    villages: TVillage[];
    coords: { x: number; y: number };
    mapType: "MAIN" | "MINI" | "POPUP";
    miniMapCenterCoords?: { x: number; y: number };
    mapConfig: { size: { width: number; height: number }; scale: number };
}) => {
    //
    villages.forEach((village) => {
        //

        let {
            x: vx,
            y: vy,
            size: vSize,
        } = calculateScreenPosition(
            { x: village.coords.x, y: village.coords.y },
            coords,
            mapConfig.scale
        );

        if (mapType === "MINI" && miniMapCenterCoords) {
            vx = vx + miniMapCenterCoords.x;
            vy = vy + miniMapCenterCoords.y;
        }

        if (
            vx < -vSize ||
            vx > mapConfig.size.width + vSize ||
            vy < -vSize ||
            vy > mapConfig.size.height + vSize
        ) {
            return;
        }

        ctx.fillStyle = villageTypeColors[village.type];
        ctx.fillRect(vx, vy, vSize, vSize);
    });
};
