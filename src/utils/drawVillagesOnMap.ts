import villageTypeColors from "../data/villageTypeColors";
import { TVillage } from "../types";
import calculateScreenPosition from "./calculateScreenPosition";

const drawVillagesOnMap = ({
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

        const {
            x,
            y,
            size: vSize,
        } = calculateScreenPosition(
            { x: village.coords.x, y: village.coords.y },
            coords,
            mapConfig.scale
        );

        let vx = x;
        let vy = y;

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

export default drawVillagesOnMap;
