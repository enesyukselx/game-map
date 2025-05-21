import terrainImages from "../data/terrainImages";
import { TTerrain } from "../types";
import calculateScreenPosition from "./calculateScreenPosition";

const drawTerrainsOnMap = ({
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
        const {
            x: vx,
            y: vy,
            size: vSize,
        } = calculateScreenPosition(
            { x: terrain.coords.x, y: terrain.coords.y },
            coords,
            mapConfig.scale
        );

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

export default drawTerrainsOnMap;
