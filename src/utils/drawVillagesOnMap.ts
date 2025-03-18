interface IVillage {
    name: string;
    coords: { x: number; y: number };
}

export const drawVillagesOnMap = ({
    ctx,
    villages,
    coords,
    mapType,
    miniMapCenterCoords,
    mapConfig,
    scaleMultiplier,
    villageSize,
}: {
    ctx: CanvasRenderingContext2D;
    villages: IVillage[];
    coords: { x: number; y: number };
    mapType: "MAIN" | "MINI";
    miniMapCenterCoords?: { x: number; y: number };
    mapConfig: { size: { width: number; height: number }; scale: number };
    scaleMultiplier: number;
    villageSize: number;
}) => {
    //
    villages.forEach((village) => {
        //
        let vx =
            (village.coords.x - coords.x) * mapConfig.scale * scaleMultiplier;
        let vy =
            (village.coords.y - coords.y) * mapConfig.scale * scaleMultiplier;
        const vSize = villageSize * mapConfig.scale;

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

        ctx.fillStyle = "red";
        ctx.fillRect(vx, vy, vSize, vSize);
    });
};
