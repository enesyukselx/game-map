import villageImages from "../data/villageImages";
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

        let villageImage;
        const villageLevel = getVillageLevel(village.point);
        if (village.type === "barbar") {
            villageImage = villageImages[villageLevel][1];
        } else {
            villageImage = villageImages[villageLevel][0];
        }

        ctx.drawImage(villageImage, vx, vy, vSize, vSize);
    });
};
