import { describe, it, expect } from "vitest";
import getVillageLevel from "../getVillageLevel";

describe("getVillageLevel", () => {
    it("returns level 1 for points less than or equal to 1000", () => {
        expect(getVillageLevel(0)).toBe(1);
        expect(getVillageLevel(500)).toBe(1);
        expect(getVillageLevel(1000)).toBe(1);
    });

    it("returns level 2 for points between 1001 and 2000", () => {
        expect(getVillageLevel(1001)).toBe(2);
        expect(getVillageLevel(1500)).toBe(2);
        expect(getVillageLevel(2000)).toBe(2);
    });

    it("returns level 3 for points between 2001 and 3000", () => {
        expect(getVillageLevel(2001)).toBe(3);
        expect(getVillageLevel(2500)).toBe(3);
        expect(getVillageLevel(3000)).toBe(3);
    });

    it("returns level 4 for points between 3001 and 6000", () => {
        expect(getVillageLevel(3001)).toBe(4);
        expect(getVillageLevel(4500)).toBe(4);
        expect(getVillageLevel(6000)).toBe(4);
    });

    it("returns level 5 for points between 6001 and 9000", () => {
        expect(getVillageLevel(6001)).toBe(5);
        expect(getVillageLevel(7500)).toBe(5);
        expect(getVillageLevel(9000)).toBe(5);
    });

    it("returns level 6 for points greater than 9000", () => {
        expect(getVillageLevel(9001)).toBe(6);
        expect(getVillageLevel(10000)).toBe(6);
    });
});
