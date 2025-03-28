import { VILLAGE_SIZE } from "../constants";
import villageImages from "../data/villageImages";
import { TVillage } from "../types";
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
