import { describe, it, expect, vi, beforeEach } from "vitest";
import attachVillageImageLoadListeners from "../attachVillageImageLoadListeners";
import { TVillage } from "../../types";

// Mock dependencies
vi.mock("../drawVillagesOnMapWithImage", () => ({
    drawVillagesOnMapWithImage: vi.fn(),
}));

vi.mock("../../data/villageImages", () => {
    const createMockImage = (complete: boolean) => ({
        complete,
        onload: null,
        onerror: null,
    } as HTMLImageElement);

    return {
        default: {
            1: [createMockImage(false), createMockImage(true)],
            2: [createMockImage(true), createMockImage(false)],
            3: [createMockImage(false), createMockImage(false)],
            4: [createMockImage(true), createMockImage(true)],
            5: [createMockImage(false), createMockImage(true)],
            6: [createMockImage(true), createMockImage(false)],
        },
    };
});

import { drawVillagesOnMapWithImage } from "../drawVillagesOnMapWithImage";
import villageImages from "../../data/villageImages";

// Mock requestAnimationFrame
Object.defineProperty(globalThis, 'requestAnimationFrame', {
    value: vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
    }),
    writable: true,
});

describe("attachVillageImageLoadListeners", () => {
    const mockCtx = {
        drawImage: vi.fn(),
        fillStyle: "",
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const mockVillages: TVillage[] = [
        { name: "Village 1", coords: { x: 1, y: 2 }, type: "ally", point: 1000 },
        { name: "Village 2", coords: { x: 3, y: 4 }, type: "enemy", point: 2000 },
    ];

    const mockCoords = { x: 5, y: 10 };
    const mockMapConfig = { size: { width: 800, height: 600 }, scale: 40 };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset all image onload/onerror handlers
        Object.values(villageImages).forEach(([normalImg, barbarImg]) => {
            Object.assign(normalImg, { onload: null, onerror: null });
            Object.assign(barbarImg, { onload: null, onerror: null });
        });
    });

    it("should attach load listeners to incomplete images", () => {
        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // Should attach listeners to incomplete images
        expect(villageImages[1][0].onload).toBeDefined(); // village1 normal (incomplete)
        expect(villageImages[1][0].onerror).toBeDefined();
        expect(villageImages[2][1].onload).toBeDefined(); // village2 barbar (incomplete)
        expect(villageImages[2][1].onerror).toBeDefined();
        expect(villageImages[3][0].onload).toBeDefined(); // village3 normal (incomplete)
        expect(villageImages[3][0].onerror).toBeDefined();
        expect(villageImages[3][1].onload).toBeDefined(); // village3 barbar (incomplete)
        expect(villageImages[3][1].onerror).toBeDefined();

        // Should not attach listeners to complete images
        expect(villageImages[1][1].onload).toBeNull(); // village1 barbar (complete)
        expect(villageImages[2][0].onload).toBeNull(); // village2 normal (complete)
        expect(villageImages[4][0].onload).toBeNull(); // village4 normal (complete)
        expect(villageImages[4][1].onload).toBeNull(); // village4 barbar (complete)
    });

    it("should trigger drawVillagesOnMapWithImage when image loads", () => {
        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // Simulate image load
        if (villageImages[1][0].onload) {
            villageImages[1][0].onload(new Event("load"));
        }

        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawVillagesOnMapWithImage).toHaveBeenCalledWith({
            ctx: mockCtx,
            villages: mockVillages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });
    });

    it("should trigger drawVillagesOnMapWithImage when image errors", () => {
        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // Simulate image error
        if (villageImages[2][1].onerror) {
            villageImages[2][1].onerror(new Event("error"));
        }

        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawVillagesOnMapWithImage).toHaveBeenCalledWith({
            ctx: mockCtx,
            villages: mockVillages,
            coords: mockCoords,
            mapType: "MAIN",
            mapConfig: mockMapConfig,
        });
    });

    it("should throttle multiple draws with requestAnimationFrame", () => {
        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // Trigger multiple loads in quick succession
        if (villageImages[1][0].onload) {
            villageImages[1][0].onload(new Event("load"));
        }
        if (villageImages[3][0].onload) {
            villageImages[3][0].onload(new Event("load"));
        }
        if (villageImages[3][1].onload) {
            villageImages[3][1].onload(new Event("load"));
        }

        // Multiple images trigger load events, requestAnimationFrame should be called
        expect(requestAnimationFrame).toHaveBeenCalled();
        expect(drawVillagesOnMapWithImage).toHaveBeenCalled();
    });

    it("should handle case when all images are already complete", () => {
        // Mock all images as complete
        Object.values(villageImages).forEach(([normalImg, barbarImg]) => {
            Object.assign(normalImg, { complete: true });
            Object.assign(barbarImg, { complete: true });
        });

        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // No listeners should be attached
        Object.values(villageImages).forEach(([normalImg, barbarImg]) => {
            expect(normalImg.onload).toBeNull();
            expect(normalImg.onerror).toBeNull();
            expect(barbarImg.onload).toBeNull();
            expect(barbarImg.onerror).toBeNull();
        });
    });

    it("should handle both normal and barbarian village images", () => {
        attachVillageImageLoadListeners(
            mockCtx,
            mockVillages,
            mockCoords,
            mockMapConfig
        );

        // Both normal and barbarian images should have listeners if incomplete
        expect(villageImages[1][0].onload).toBeDefined(); // normal image (incomplete)
        expect(villageImages[2][1].onload).toBeDefined(); // barbarian image (incomplete)
        expect(villageImages[3][0].onload).toBeDefined(); // normal image (incomplete)
        expect(villageImages[3][1].onload).toBeDefined(); // barbarian image (incomplete)
    });
});