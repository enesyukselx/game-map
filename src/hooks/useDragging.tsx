import { useState, useCallback } from "react";
import { TCoords, TMapConfig } from "../types";

interface IUseDraggingProps {
    setCoords: (coords: TCoords | ((prev: TCoords) => TCoords)) => void;
    mainMapConfig: TMapConfig;
    miniMapConfig: TMapConfig;
}

interface IUseDraggingResult {
    isDragging: boolean;
    eventListeners: {
        onmousedown: (e: MouseEvent) => void;
        onmousemove: (e: MouseEvent, mapType?: "MAIN" | "MINI") => void;
        onmouseup: () => void;
        onmouseleave: () => void;
    };
}

const useDragging = ({
    setCoords,
    mainMapConfig,
    miniMapConfig,
}: IUseDraggingProps): IUseDraggingResult => {
    const [isDragging, setIsDragging] = useState(false);
    const [mouseDownCoords, setMouseDownCoords] = useState<{
        x: number;
        y: number;
    } | null>(null);

    const handleMouseDown = useCallback((e: MouseEvent) => {
        setIsDragging(true);
        setMouseDownCoords({ x: e.offsetX, y: e.offsetY });
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent, mapType: "MAIN" | "MINI" = "MAIN") => {
            if (isDragging && mouseDownCoords) {
                const deltaX = e.offsetX - mouseDownCoords.x;
                const deltaY = e.offsetY - mouseDownCoords.y;

                // Which map is being dragged
                const scale =
                    mapType === "MAIN"
                        ? mainMapConfig.scale
                        : miniMapConfig.scale;

                // Update the coordinates
                setCoords((prevCoords) => ({
                    x: prevCoords.x - deltaX / scale,
                    y: prevCoords.y - deltaY / scale,
                }));

                // Update the mouse down coordinates
                setMouseDownCoords({ x: e.offsetX, y: e.offsetY });
            }
        },
        [
            isDragging,
            mouseDownCoords,
            mainMapConfig.scale,
            miniMapConfig.scale,
            setCoords,
        ]
    );

    const handleMouseUp = useCallback(() => {
        setMouseDownCoords(null);
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const eventListeners = {
        onmousedown: handleMouseDown,
        onmousemove: handleMouseMove,
        onmouseup: handleMouseUp,
        onmouseleave: handleMouseLeave,
    };

    return {
        isDragging,
        eventListeners,
    };
};

export default useDragging;
