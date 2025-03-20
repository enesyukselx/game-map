import { VILLAGE_SIZE } from "../constants";
import { TVillage } from "../types";

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
        let vx = (village.coords.x - coords.x) * mapConfig.scale;
        let vy = (village.coords.y - coords.y) * mapConfig.scale;
        const vSize = VILLAGE_SIZE * mapConfig.scale;

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

        let villageColor = "darkred";
        if (village.type === "ally") villageColor = "blue";
        if (village.type === "enemy") villageColor = "red";
        if (village.type === "barbar") villageColor = "gray";

        ctx.fillStyle = villageColor;
        ctx.fillRect(vx, vy, vSize, vSize);
    });
};
