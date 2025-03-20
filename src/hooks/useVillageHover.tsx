import { useState, useEffect } from "react";
import { TVillage, TCoords, TMapConfig } from "../types";
import { VILLAGE_SIZE } from "../constants";

interface IUseVillageHoverResult {
    hoveredVillage: TVillage | null;
    hoverPosition: { x: number; y: number } | null;
}

export const useVillageHover = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    isDragging: boolean,
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

        const handleClick = () => {
            if (hoveredVillage) {
                alert(`Clicked on village: ${hoveredVillage.name}`);
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if mouse is over any village
            let found = false;

            // If dragging, don't show hover effect
            if (isDragging) return setHoveredVillage(null);

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

        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            canvas.removeEventListener("click", handleClick);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [
        canvasRef,
        villages,
        coords,
        mapConfig.scale,
        hoveredVillage,
        isDragging,
    ]);

    // Change cursor style based on hovered village
    useEffect(() => {
        if (!canvasRef.current) return;
        if (!hoveredVillage) {
            canvasRef.current.style.cursor = "default";
            return;
        }
        canvasRef.current.style.cursor = "pointer";
    }, [hoveredVillage, canvasRef]);

    return { hoveredVillage, hoverPosition };
};

export default useVillageHover;
