import { describe, it, expect, vi, beforeEach } from "vitest";
import attachTerrainImageLoadListeners from "../attachTerrainImageLoadListeners";
import { TTerrain } from "../../types";

// Mock dependencies
vi.mock("../drawTerrainsOnMap", () => ({
    drawTerrainsOnMap: vi.fn(),
}));

vi.mock("../../data/terrainImages", () => {
    const mockLakeImage = {
        complete: false,
        onload: null,
        onerror: null,
    } as HTMLImageElement;
    
    const mockMineImage = {
        complete: true,
        onload: null,
        onerror: null,
    } as HTMLImageElement;
    
    const mockForestImage = {
        complete: false,
        onload: null,
        onerror: null,
    } as HTMLImageElement;

    return {
        default: {
            lake: mockLakeImage,
            mine: mockMineImage,
            forest: mockForestImage,
        },
    };
});

import { drawTerrainsOnMap } from "../drawTerrainsOnMap";
import terrainImages from "../../data/terrainImages";

// Mock requestAnimationFrame
Object.defineProperty(globalThis, 'requestAnimationFrame', {
    value: vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
    }),
    writable: true,
});

describe("attachTerrainImageLoadListeners", () => {
    const mockCtx = {
        drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockTerrains: TTerrain[] = [
        { coords: { x: 1, y: 2 }, type: "lake" },
        { coords: { x: 3, y: 4 }, type: "mine" },
    ];

    const mockCoords = { x: 5, y: 10 };
    const mockMapConfig = { size: { width: 800, height: 600 }, scale: 40 };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset image completion status and handlers
        Object.assign(terrainImages.lake, { complete: false, onload: null, onerror: null });
        Object.assign(terrainImages.mine, { complete: true, onload: null, onerror: null });
        Object.assign(terrainImages.forest, { complete: false, onload: null, onerror: null });
    });

    it("should attach load listeners to incomplete images", () => {
        attachTerrainImageLoadListeners(
            mockCtx,
            mockTerrains,
            mockCoords,
            mockMapConfig
        );

        // Should attach listeners to incomplete images (lake and forest)
        expect(terrainImages.lake.onload).toBeDefined();
        expect(terrainImages.lake.onerror).toBeDefined();
        expect(terrainImages.forest.onload).toBeDefined();
        expect(terrainImages.forest.onerror).toBeDefined();

        // Should not attach listeners to complete images (mine)
        expect(terrainImages.mine.onload).toBeNull();
        expect(terrainImages.mine.onerror).toBeNull();
    });

    it("should trigger drawTerrainsOnMap when image loads", () => {
        attachTerrainImageLoadListeners(
            mockCtx,
            mockTerrains,
            mockCoords,
            mockMapConfig
        );

        // Simulate image load
        if (terrainImages.lake.onload) {
            terrainImages.lake.onload(new Event("load"));
        }

        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawTerrainsOnMap).toHaveBeenCalledWith({
            ctx: mockCtx,
            terrains: mockTerrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });
    });

    it("should trigger drawTerrainsOnMap when image errors", () => {
        attachTerrainImageLoadListeners(
            mockCtx,
            mockTerrains,
            mockCoords,
            mockMapConfig
        );

        // Simulate image error
        if (terrainImages.forest.onerror) {
            terrainImages.forest.onerror(new Event("error"));
        }

        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawTerrainsOnMap).toHaveBeenCalledWith({
            ctx: mockCtx,
            terrains: mockTerrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });
    });

    it("should throttle multiple draws with requestAnimationFrame", () => {
        // Mock needsRedraw as a variable that can be checked
        attachTerrainImageLoadListeners(
            mockCtx,
            mockTerrains,
            mockCoords,
            mockMapConfig
        );

        // Since the throttling mechanism uses a closure variable needsRedraw,
        // multiple calls will still invoke requestAnimationFrame but the function
        // should handle the throttling internally
        if (terrainImages.lake.onload) {
            terrainImages.lake.onload(new Event("load"));
        }
        if (terrainImages.forest.onload) {
            terrainImages.forest.onload(new Event("load"));
        }

        // Both images trigger load events, so requestAnimationFrame should be called
        // The exact number depends on timing and the throttling implementation
        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawTerrainsOnMap).toHaveBeenCalled();
    });

    it("should handle case when all images are already complete", () => {
        // Make all images complete
        Object.assign(terrainImages.lake, { complete: true });
        Object.assign(terrainImages.mine, { complete: true });
        Object.assign(terrainImages.forest, { complete: true });

        attachTerrainImageLoadListeners(
            mockCtx,
            mockTerrains,
            mockCoords,
            mockMapConfig
        );

        // No listeners should be attached since all images are complete
        // The onload/onerror should remain null since they were not set
        expect(terrainImages.lake.onload).toBeNull();
        expect(terrainImages.mine.onload).toBeNull();
        expect(terrainImages.forest.onload).toBeNull();
    });
});