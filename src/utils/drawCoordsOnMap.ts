import { VILLAGE_SIZE } from "../constants";

export const drawCoordsOnMap = ({
    ctx,
    coords,
    mapConfig,
}: {
    ctx: CanvasRenderingContext2D;
    coords: { x: number; y: number };
    mapConfig: { size: { width: number; height: number }; scale: number };
}) => {
    if (mapConfig.scale >= 40) {
        // Save the current canvas state
        ctx.save();

        // Set fill style to black with 0.1 opacity
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";

        // Draw left border - 30px wide, full height
        ctx.fillRect(0, 0, 20, mapConfig.size.height);

        // Draw bottom border - full width, 30px high
        ctx.fillRect(20, mapConfig.size.height - 20, mapConfig.size.width, 30);

        // Set text properties for coordinates
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        const cordGap = VILLAGE_SIZE * mapConfig.scale;
        const visibleAreaWidthInCords = mapConfig.size.width / cordGap;
        const visibleAreaHeightInCords = mapConfig.size.height / cordGap;

        for (
            let i = coords.y - cordGap;
            i <= visibleAreaHeightInCords + 1;
            i++
        ) {
            ctx.fillText(
                Math.round(coords.y + i - 1).toString(),
                10,
                cordGap * i - cordGap / 2
            );
        }

        for (
            let i = coords.x - cordGap;
            i <= visibleAreaWidthInCords + 1;
            i++
        ) {
            ctx.fillText(
                Math.round(coords.x + i - 1).toString(),
                cordGap * i - cordGap / 2,
                mapConfig.size.height - 5
            );
        }
    }

    // Restore the canvas state
    ctx.restore();
};
