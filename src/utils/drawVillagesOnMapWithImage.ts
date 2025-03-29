import villageImages from "../data/villageImages";
import villageTypeColors from "../data/villageTypeColors";
import { TVillage } from "../types";
import { calculateScreenPosition } from "./calculateScreenPosition";
import getVillageLevel from "./getVillageLevel";

export const drawVillagesOnMapWithImage = ({
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

        let villageImage;
        const villageLevel = getVillageLevel(village.point);
        if (village.type === "barbar") {
            villageImage = villageImages[villageLevel][1];
        } else {
            villageImage = villageImages[villageLevel][0];
        }

        // Draw the village circle for the type
        ctx.fillStyle = villageTypeColors[village.type];
        ctx.beginPath();
        ctx.arc(vx + 5, vy + 5, 0.04 * mapConfig.scale, 0, Math.PI * 2);
        ctx.fill();
        // Draw the village image
        ctx.drawImage(villageImage, vx, vy, vSize, vSize);
    });
};
