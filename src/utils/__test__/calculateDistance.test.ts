import { describe, it, expect } from "vitest";
import calculateDistance from "../calculateDistance";

describe("calculateDistance", () => {
    it("calculates the distance between two points correctly", () => {
        const pointA = { x: 0, y: 0 };
        const pointB = { x: 3, y: 4 };
        expect(calculateDistance(pointA, pointB)).toBe(5);
    });

    it("returns 0 for the same point", () => {
        const pointA = { x: 1, y: 1 };
        expect(calculateDistance(pointA, pointA)).toBe(0);
    });

    it("calculates distance with negative coordinates", () => {
        const pointA = { x: -1, y: -1 };
        const pointB = { x: 2, y: 2 };
        expect(calculateDistance(pointA, pointB)).toBe(Math.sqrt(18));
    });
});
