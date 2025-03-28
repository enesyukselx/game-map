import { VILLAGE_SIZE } from "../constants";
import terrainImages from "../data/terrainImages";
import { TTerrain } from "../types";

export const drawTerrainsOnMap = ({
    ctx,
    terrains,
    coords,
    mapConfig,
}: {
    ctx: CanvasRenderingContext2D;
    terrains: TTerrain[];
    coords: { x: number; y: number };
    mapConfig: { size: { width: number; height: number }; scale: number };
}) => {
    //
    terrains.forEach((terrain) => {
        //
        const vx = (terrain.coords.x - coords.x) * mapConfig.scale;
        const vy = (terrain.coords.y - coords.y) * mapConfig.scale;
        const vSize = VILLAGE_SIZE * mapConfig.scale;

        if (
            vx < -vSize ||
            vx > mapConfig.size.width + vSize ||
            vy < -vSize ||
            vy > mapConfig.size.height + vSize
        ) {
            return;
        }

        const terrainImage = terrainImages[terrain.type];

        ctx.drawImage(terrainImage, vx, vy, vSize, vSize);
    });
};
