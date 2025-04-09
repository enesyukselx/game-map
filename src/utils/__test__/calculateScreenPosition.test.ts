import { describe, it, expect } from "vitest";
import { calculateScreenPosition } from "../calculateScreenPosition";
import { VILLAGE_SIZE } from "../../constants";

describe("calculateScreenPosition", () => {
    it("should correctly calculate screen position when viewport is at origin", () => {
        const objectCoords = { x: 100, y: 200 };
        const viewportCoords = { x: 0, y: 0 };
        const scale = 1;

        const result = calculateScreenPosition(
            objectCoords,
            viewportCoords,
            scale
        );

        expect(result).toEqual({
            x: 100,
            y: 200,
            size: VILLAGE_SIZE,
        });
    });

    it("should correctly calculate screen position with viewport offset", () => {
        const objectCoords = { x: 100, y: 200 };
        const viewportCoords = { x: 50, y: 50 };
        const scale = 1;

        const result = calculateScreenPosition(
            objectCoords,
            viewportCoords,
            scale
        );

        expect(result).toEqual({
            x: 50,
            y: 150,
            size: VILLAGE_SIZE,
        });
    });

    it("should correctly apply scale to position and size", () => {
        const objectCoords = { x: 100, y: 200 };
        const viewportCoords = { x: 0, y: 0 };
        const scale = 2;

        const result = calculateScreenPosition(
            objectCoords,
            viewportCoords,
            scale
        );

        expect(result).toEqual({
            x: 200,
            y: 400,
            size: VILLAGE_SIZE * 2,
        });
    });

    it("should correctly handle negative coordinates", () => {
        const objectCoords = { x: -50, y: -100 };
        const viewportCoords = { x: -100, y: -200 };
        const scale = 1.5;

        const result = calculateScreenPosition(
            objectCoords,
            viewportCoords,
            scale
        );

        expect(result).toEqual({
            x: 75,
            y: 150,
            size: VILLAGE_SIZE * 1.5,
        });
    });
});
