import { describe, it, expect, vi, beforeEach } from "vitest";
import { drawVillagesOnMapWithImage } from "../drawVillagesOnMapWithImage";
import { TVillage } from "../../types";

// Mock dependencies
vi.mock("../calculateScreenPosition", () => ({
    calculateScreenPosition: vi.fn(),
}));

vi.mock("../getVillageLevel", () => ({
    default: vi.fn(),
}));

vi.mock("../../data/villageImages", () => {
    const createMockImage = () => ({} as HTMLImageElement);

    return {
        default: {
            1: [createMockImage(), createMockImage()],
            2: [createMockImage(), createMockImage()],
            3: [createMockImage(), createMockImage()],
            4: [createMockImage(), createMockImage()],
            5: [createMockImage(), createMockImage()],
            6: [createMockImage(), createMockImage()],
        },
    };
});

vi.mock("../../data/villageTypeColors", () => ({
    default: {
        barbar: "black",
        ally: "blue",
        enemy: "red",
        unknown: "darkred",
    },
}));

import { calculateScreenPosition } from "../calculateScreenPosition";
import getVillageLevel from "../getVillageLevel";
import villageImages from "../../data/villageImages";
import villageTypeColors from "../../data/villageTypeColors";

describe("drawVillagesOnMapWithImage", () => {
    const mockCtx = {
        drawImage: vi.fn(),
        fillStyle: "",
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockCoords = { x: 5, y: 10 };
    const mockMapConfig = { size: { width: 800, height: 600 }, scale: 40 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should draw non-barbarian villages with images and colored circles", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "ally",
                point: 1000,
            },
        ];

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });
        vi.mocked(getVillageLevel).mockReturnValue(3);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });

        expect(getVillageLevel).toHaveBeenCalledWith(1000);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            villageImages[3][0], // Normal village image (not barbarian)
            100,
            150,
            20,
            20
        );
        expect(mockCtx.fillStyle).toBe(villageTypeColors.ally);
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(105, 155, 1.6, 0, Math.PI * 2);
        expect(mockCtx.fill).toHaveBeenCalled();
    });

    it("should draw barbarian villages with barbarian images and no colored circles", () => {
        const villages: TVillage[] = [
            {
                name: "Barbarian Village",
                coords: { x: 1, y: 2 },
                type: "barbar",
                point: 500,
            },
        ];

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 200,
            y: 250,
            size: 20,
        });
        vi.mocked(getVillageLevel).mockReturnValue(2);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });

        expect(getVillageLevel).toHaveBeenCalledWith(500);
        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            villageImages[2][1], // Barbarian village image
            200,
            250,
            20,
            20
        );
        // Should not draw colored circle for barbarian villages
        expect(mockCtx.beginPath).not.toHaveBeenCalled();
        expect(mockCtx.arc).not.toHaveBeenCalled();
        expect(mockCtx.fill).not.toHaveBeenCalled();
    });

    it("should draw villages on MINI map with center coordinates", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "enemy",
                point: 1500,
            },
        ];

        const miniMapCenterCoords = { x: 50, y: 80 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });
        vi.mocked(getVillageLevel).mockReturnValue(4);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MINI",
            miniMapCenterCoords,
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            villageImages[4][0],
            150, // 100 + 50 (center offset)
            230, // 150 + 80 (center offset)
            20,
            20
        );
        expect(mockCtx.arc).toHaveBeenCalledWith(155, 235, 1.6, 0, Math.PI * 2);
    });

    it("should not draw villages outside viewport bounds", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "ally",
                point: 1000,
            },
        ];

        // Mock position outside viewport
        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: -100,
            y: -100,
            size: 20,
        });
        vi.mocked(getVillageLevel).mockReturnValue(1);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).not.toHaveBeenCalled();
        expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });

    it("should handle multiple villages with different types and levels", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "ally",
                point: 1000,
            },
            {
                name: "Village 2",
                coords: { x: 3, y: 4 },
                type: "enemy",
                point: 2500,
            },
            {
                name: "Village 3",
                coords: { x: 5, y: 6 },
                type: "barbar",
                point: 300,
            },
        ];

        vi.mocked(calculateScreenPosition)
            .mockReturnValueOnce({ x: 100, y: 150, size: 20 })
            .mockReturnValueOnce({ x: 200, y: 250, size: 20 })
            .mockReturnValueOnce({ x: 300, y: 350, size: 20 });

        vi.mocked(getVillageLevel)
            .mockReturnValueOnce(2)
            .mockReturnValueOnce(5)
            .mockReturnValueOnce(1);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).toHaveBeenCalledTimes(3);
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            1,
            villageImages[2][0],
            100,
            150,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            2,
            villageImages[5][0],
            200,
            250,
            20,
            20
        );
        expect(mockCtx.drawImage).toHaveBeenNthCalledWith(
            3,
            villageImages[1][1], // Barbarian image
            300,
            350,
            20,
            20
        );

        // Should draw circles for ally and enemy but not barbarian
        expect(mockCtx.beginPath).toHaveBeenCalledTimes(2);
        expect(mockCtx.arc).toHaveBeenCalledTimes(2);
        expect(mockCtx.fill).toHaveBeenCalledTimes(2);
    });

    it("should work with POPUP map type", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "unknown",
                point: 800,
            },
        ];

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 120,
            y: 180,
            size: 30,
        });
        vi.mocked(getVillageLevel).mockReturnValue(3);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "POPUP",
            mapConfig: mockMapConfig,
        });

        expect(mockCtx.drawImage).toHaveBeenCalledWith(
            villageImages[3][0],
            120,
            180,
            30,
            30
        );
        expect(mockCtx.fillStyle).toBe(villageTypeColors.unknown);
        expect(mockCtx.arc).toHaveBeenCalledWith(125, 185, 1.6, 0, Math.PI * 2);
    });

    it("should handle different map scales correctly", () => {
        const villages: TVillage[] = [
            {
                name: "Village 1",
                coords: { x: 1, y: 2 },
                type: "ally",
                point: 1000,
            },
        ];

        const largeScaleMapConfig = { size: { width: 800, height: 600 }, scale: 80 };

        vi.mocked(calculateScreenPosition).mockReturnValue({
            x: 100,
            y: 150,
            size: 20,
        });
        vi.mocked(getVillageLevel).mockReturnValue(3);

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: largeScaleMapConfig,
        });

        // Arc radius should be scaled: 0.04 * 80 = 3.2
        expect(mockCtx.arc).toHaveBeenCalledWith(105, 155, 3.2, 0, Math.PI * 2);
    });

    it("should handle empty villages array", () => {
        const villages: TVillage[] = [];

        drawVillagesOnMapWithImage({
            ctx: mockCtx,
            villages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });

        expect(calculateScreenPosition).not.toHaveBeenCalled();
        expect(getVillageLevel).not.toHaveBeenCalled();
        expect(mockCtx.drawImage).not.toHaveBeenCalled();
        expect(mockCtx.beginPath).not.toHaveBeenCalled();
    });
});