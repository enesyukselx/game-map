import { describe, it, expect, vi } from "vitest";
import { drawCoordsOnMap } from "../drawCoordsOnMap";
import { VILLAGE_SIZE } from "../../constants";

describe("drawCoordsOnMap", () => {
    it("should draw coordinates on the map when scale is >= 40", () => {
        // Mock the canvas context
        const fillStyles: string[] = [];
        let currentFillStyle = "";

        const ctx = {
            save: vi.fn(),
            restore: vi.fn(),
            fillRect: vi.fn(),
            fillText: vi.fn(),
            font: "",
            textAlign: "",
            get fillStyle() {
                return currentFillStyle;
            },
            set fillStyle(value: string) {
                currentFillStyle = value;
                fillStyles.push(value);
            },
        } as unknown as CanvasRenderingContext2D;

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 50 };

        drawCoordsOnMap({ ctx, coords, mapConfig });

        // Check if the canvas state was saved and restored
        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.restore).toHaveBeenCalled();

        // Check if the fill style was set correctly
        expect(fillStyles[0]).toBe("rgba(0, 0, 0, 0.1)");
        expect(fillStyles[1]).toBe("rgba(255, 255, 255, 0.8)");

        // Check if the font and text alignment were set correctly
        expect(ctx.font).toBe("12px Arial");
        expect(ctx.textAlign).toBe("center");

        // Check if draw left and bottom borders were called
        expect(ctx.fillRect).toHaveBeenCalledWith(
            0,
            0,
            20,
            mapConfig.size.height
        );
        expect(ctx.fillRect).toHaveBeenCalledWith(
            20,
            mapConfig.size.height - 20,
            mapConfig.size.width,
            30
        );

        const cordGap = VILLAGE_SIZE * mapConfig.scale;
        const visibleAreaWidthInCords = mapConfig.size.width / cordGap;
        const visibleAreaHeightInCords = mapConfig.size.height / cordGap;

        // Check if the coordinates were drawn correctly
        for (
            let i = 0 - (coords.y % 1);
            i <= visibleAreaHeightInCords + 1;
            i++
        ) {
            expect(ctx.fillText).toHaveBeenCalledWith(
                Math.round(coords.y + i - 1).toString(),
                10,
                cordGap * i - cordGap / 2
            );
        }
        for (
            let i = 0 - (coords.x % 1);
            i <= visibleAreaWidthInCords + 1;
            i++
        ) {
            expect(ctx.fillText).toHaveBeenCalledWith(
                Math.round(coords.x + i - 1).toString(),
                cordGap * i - cordGap / 2,
                mapConfig.size.height - 5
            );
        }

        // Check if fillText was called at least once
        expect(ctx.fillText).toHaveBeenCalled();
    });

    it("should not draw coordinates on the map when scale is < 40", () => {
        // Mock the canvas context
        const ctx = {
            save: vi.fn(),
            restore: vi.fn(),
            fillRect: vi.fn(),
            fillText: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 30 };

        drawCoordsOnMap({ ctx, coords, mapConfig });

        expect(ctx.restore).toHaveBeenCalled();
        expect(ctx.fillRect).not.toHaveBeenCalled();
        expect(ctx.fillText).not.toHaveBeenCalled();
    });
});
