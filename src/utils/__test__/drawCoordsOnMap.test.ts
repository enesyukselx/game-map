import { describe, it, expect, vi } from "vitest";
import { drawCoordsOnMap } from "../drawCoordsOnMap";

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

        // Check if fillRect was called with correct arguments
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

        // Check if fillText was called at least once
        expect(ctx.fillText).toHaveBeenCalled();

        // Verify that we don't draw coordinates if scale is less than 40
        const smallScaleCtx = {
            ...ctx,
            save: vi.fn(),
            restore: vi.fn(),
            fillRect: vi.fn(),
            fillText: vi.fn(),
        };
        const smallScaleConfig = { ...mapConfig, scale: 30 };
        drawCoordsOnMap({
            ctx: smallScaleCtx,
            coords,
            mapConfig: smallScaleConfig,
        });
        expect(smallScaleCtx.fillRect).not.toHaveBeenCalled();
        expect(smallScaleCtx.fillText).not.toHaveBeenCalled();
    });
});
