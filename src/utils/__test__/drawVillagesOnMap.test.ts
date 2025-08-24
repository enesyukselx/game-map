import { describe, it, expect, vi } from "vitest";
import { drawVillagesOnMap } from "../drawVillagesOnMap";
import villageTypeColors from "../../data/villageTypeColors";
import { TVillage } from "../../types";

// Mock calculateScreenPosition
vi.mock("../calculateScreenPosition", () => ({
    calculateScreenPosition: vi.fn(),
}));

import { calculateScreenPosition } from "../calculateScreenPosition";

describe("drawVillagesOnMap", () => {
    it("should draw villages on the map for MAIN map type", () => {
        const ctx = {
            fillStyle: "",
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "enemy",
                point: 1000,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 40 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });

        drawVillagesOnMap({
            ctx,
            villages,
            coords,
            mapType: "MAIN",
            mapConfig,
        });

        expect(calculateScreenPosition).toHaveBeenCalledWith(
            { x: 1, y: 2 },
            coords,
            mapConfig.scale
        );
        expect(ctx.fillStyle).toBe(villageTypeColors.enemy);
        expect(ctx.fillRect).toHaveBeenCalledWith(100, 150, 20, 20);
    });

    it("should draw villages on MINI map with center coordinates", () => {
        const ctx = {
            fillStyle: "",
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "ally",
                point: 1000,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 40 };
        const miniMapCenterCoords = { x: 50, y: 80 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });

        drawVillagesOnMap({
            ctx,
            villages,
            coords,
            mapType: "MINI",
            miniMapCenterCoords,
            mapConfig,
        });

        expect(ctx.fillStyle).toBe(villageTypeColors.ally);
        expect(ctx.fillRect).toHaveBeenCalledWith(150, 230, 20, 20);
    });

    it("should not draw villages outside viewport bounds", () => {
        const ctx = {
            fillStyle: "",
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "barbar",
                point: 1000,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 40 };

        // Mock position outside viewport
        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: -100,
            y: -100,
            size: 20,
        });

        drawVillagesOnMap({
            ctx,
            villages,
            coords,
            mapType: "MAIN",
            mapConfig,
        });

        expect(ctx.fillRect).not.toHaveBeenCalled();
    });

    it("should handle multiple villages with different types", () => {
        const ctx = {
            fillStyle: "",
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "enemy",
                point: 1000,
            },
            {
                name: "Village 2",
                coords: { x: 3, y: 4 },
                type: "ally",
                point: 2000,
            },
            {
                name: "Village 3",
                coords: { x: 5, y: 6 },
                type: "unknown",
                point: 500,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 800, height: 600 }, scale: 40 };

        vi.mocked(calculateScreenPosition)
            .mockReturnValueOnce({ x: 100, y: 150, size: 20 })
            .mockReturnValueOnce({ x: 200, y: 250, size: 20 })
            .mockReturnValueOnce({ x: 300, y: 350, size: 20 });

        drawVillagesOnMap({
            ctx,
            villages,
            coords,
            mapType: "MAIN",
            mapConfig,
        });

        expect(ctx.fillRect).toHaveBeenCalledTimes(3);
        expect(ctx.fillRect).toHaveBeenNthCalledWith(1, 100, 150, 20, 20);
        expect(ctx.fillRect).toHaveBeenNthCalledWith(2, 200, 250, 20, 20);
        expect(ctx.fillRect).toHaveBeenNthCalledWith(3, 300, 350, 20, 20);
    });

    it("should work with POPUP map type", () => {
        const ctx = {
            fillStyle: "",
            fillRect: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "barbar",
                point: 1000,
            },
        ];

        const coords = { x: 5, y: 10 };
        const mapConfig = { size: { width: 400, height: 300 }, scale: 60 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 120,
            y: 180,
            size: 30,
        });

        drawVillagesOnMap({
            ctx,
            villages,
            coords,
            mapType: "POPUP",
            mapConfig,
        });

        expect(ctx.fillStyle).toBe(villageTypeColors.barbar);
        expect(ctx.fillRect).toHaveBeenCalledWith(120, 180, 30, 30);
    });
});
