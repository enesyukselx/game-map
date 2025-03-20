import { useState, useEffect } from "react";
import { TVillage, TCoords, TMapConfig } from "../types";
import { VILLAGE_SIZE } from "../constants";

interface IUseVillageHoverResult {
    hoveredVillage: TVillage | null;
    hoverPosition: { x: number; y: number } | null;
}

export const useVillageHover = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    villages: TVillage[],
    coords: TCoords,
    mapConfig: TMapConfig
): IUseVillageHoverResult => {
    const [hoveredVillage, setHoveredVillage] = useState<TVillage | null>(null);
    const [hoverPosition, setHoverPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if mouse is over any village
            let found = false;

            for (const village of villages) {
                const vx = (village.coords.x - coords.x) * mapConfig.scale;
                const vy = (village.coords.y - coords.y) * mapConfig.scale;
                const vSize = VILLAGE_SIZE * mapConfig.scale;

                if (
                    mouseX >= vx &&
                    mouseX <= vx + vSize &&
                    mouseY >= vy &&
                    mouseY <= vy + vSize
                ) {
                    setHoveredVillage(village);
                    setHoverPosition({ x: e.clientX, y: e.clientY });
                    found = true;
                    break;
                }
            }

            if (!found && hoveredVillage) {
                setHoveredVillage(null);
                setHoverPosition(null);
            }
        };

        const handleMouseLeave = () => {
            setHoveredVillage(null);
            setHoverPosition(null);
        };

        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [canvasRef, villages, coords, mapConfig.scale, hoveredVillage]);

    return { hoveredVillage, hoverPosition };
};

export default useVillageHover;
