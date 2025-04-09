import { describe, it, expect, vi } from "vitest";
import { clearMap } from "../clearMap";

describe("clearMap", () => {
    it("should clear the canvas with the specified dimensions", () => {
        // Mock the canvas context
        const ctx = {
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            fillStyle: "",
        } as unknown as CanvasRenderingContext2D;

        const width = 800;
        const height = 600;
        const backgroundColor = "#000000";

        clearMap({ ctx, width, height, backgroundColor });

        // Check if clearRect was called with correct parameters
        expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    it("should set the background color correctly", () => {
        // Mock the canvas context
        const ctx = {
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            fillStyle: "",
        } as unknown as CanvasRenderingContext2D;

        const width = 800;
        const height = 600;
        const backgroundColor = "#ffffff";

        clearMap({ ctx, width, height, backgroundColor });

        // Check if fillStyle was set correctly
        expect(ctx.fillStyle).toBe(backgroundColor);
    });

    it("should fill the rectangle with the correct dimensions", () => {
        // Mock the canvas context
        const ctx = {
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            fillStyle: "",
        } as unknown as CanvasRenderingContext2D;

        const width = 1024;
        const height = 768;
        const backgroundColor = "#cccccc";

        clearMap({ ctx, width, height, backgroundColor });

        // Check if fillRect was called with correct parameters
        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    it("should call methods in the correct order", () => {
        // Mock the canvas context with tracking order of calls
        const calls: string[] = [];
        const ctx = {
            clearRect: vi.fn(() => calls.push("clearRect")),
            fillRect: vi.fn(() => calls.push("fillRect")),
            set fillStyle(_value: string) {
                calls.push("fillStyle");
            },
        } as unknown as CanvasRenderingContext2D;

        clearMap({ ctx, width: 100, height: 100, backgroundColor: "#333333" });

        // Verify the order of operations
        expect(calls).toEqual(["clearRect", "fillStyle", "fillRect"]);
    });
});
