import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawTerrainsOnMap } from "../drawTerrainsOnMap";
import { TTerrain } from "../../types";

// Mock dependencies
vi.mock("../calculateScreenPosition", () => ({
    calculateScreenPosition: vi.fn(),
}));

vi.mock("../../data/terrainImages", () => {
    const mockLakeImage = {} as HTMLImageElement;
    const mockMineImage = {} as HTMLImageElement;
    const mockForestImage = {} as HTMLImageElement;

    return {
        default: {
            lake: mockLakeImage,
            mine: mockMineImage,
            forest: mockForestImage,
        },
    };
});

import { calculateScreenPosition } from "../calculateScreenPosition";
import terrainImages from "../../data/terrainImages";

describe("drawTerrainsOnMap", () => {
    const mockCtx = {
        drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockCoords = { x: 5, y: 10 };
    const mockMapConfig = { size: { width: 800, height: 600 }, scale: 40 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should draw terrains on the map", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "lake" },
            { coords: { x: 3, y: 4 }, type: "mine" },
            { coords: { x: 5, y: 6 }, type: "forest" },
        ];

        vi.mocked(calculateScreenPosition)
            .mockReturnValueOnce({ x: 100, y: 150, size: 20 })
            .mockReturnValueOnce({ x: 200, y: 250, size: 20 })
            .mockReturnValueOnce({ x: 300, y: 350, size: 20 });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(calculateScreenPosition).toHaveBeenCalledTimes(3);
        expect(calculateScreenPosition).toHaveBeenNthCalledWith(
            1,
            { x: 1, y: 2 },
            mockCoords,
            mockMapConfig.scale
        );
        expect(calculateScreenPosition).toHaveBeenNthCalledWith(
            2,
            { x: 3, y: 4 },
            mockCoords,
            mockMapConfig.scale
        );
        expect(calculateScreenPosition).toHaveBeenNthCalledWith(
            3,
            { x: 5, y: 6 },
            mockCoords,
            mockMapConfig.scale
        );

        expect(mockCtx.drawImage).toHaveBeenCalledTimes(3);
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            1,
            terrainImages.lake,
            100,
            150,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            2,
            terrainImages.mine,
            200,
            250,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            3,
            terrainImages.forest,
            300,
            350,
            20,
            20
        );
    });

    it("should not draw terrains outside viewport bounds (left and top)", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "lake" },
        ];

        // Mock position outside viewport (left and top)
        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: -100,
            y: -100,
            size: 20,
        });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).not.toHaveBeenCalled();
    });

    it("should not draw terrains outside viewport bounds (right and bottom)", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "mine" },
        ];

        // Mock position outside viewport (right and bottom)
        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 900,
            y: 700,
            size: 20,
        });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).not.toHaveBeenCalled();
    });

    it("should draw terrains that are partially visible", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "forest" },
        ];

        // Mock position at the edge of viewport but still visible
        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 790,
            y: 590,
            size: 20,
        });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            terrainImages.forest,
            790,
            590,
            20,
            20
        );
    });

    it("should handle empty terrains array", () => {
        const terrains: TTerrain[] = [];

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(calculateScreenPosition).not.toHaveBeenCalled();
        expect(mockCtx.drawImage).not.toHaveBeenCalled();
    });

    it("should handle different terrain types correctly", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "lake" },
            { coords: { x: 3, y: 4 }, type: "mine" },
            { coords: { x: 5, y: 6 }, type: "forest" },
        ];

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            1,
            terrainImages.lake,
            100,
            150,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            2,
            terrainImages.mine,
            100,
            150,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            3,
            terrainImages.forest,
            100,
            150,
            20,
            20
        );
    });

    it("should work with different map scales", () => {
        const terrains: TTerrain[] = [
            { coords: { x: 1, y: 2 }, type: "lake" },
        ];

        const largeScaleMapConfig = { size: { width: 800, height: 600 }, scale: 80 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 120,
            y: 180,
            size: 40,
        });

        drawTerrainsOnMap({
            ctx: mockCtx,
            terrains,
            coords: mockCoords,
            mapConfig: largeScaleMapConfig,
        });

        expect(calculateScreenPosition).toHaveBeenCalledWith(
            { x: 1, y: 2 },
            mockCoords,
            largeScaleMapConfig.scale
        );
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            terrainImages.lake,
            120,
            180,
            40,
            40
        );
    });
});