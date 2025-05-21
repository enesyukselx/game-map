import { useState, useCallback, useRef } from "react";
import { TCoords, TMapConfig } from "../types";

interface IUseTouchProps {
    setCoords: (coords: TCoords | ((prev: TCoords) => TCoords)) => void;
    mainMapConfig: TMapConfig;
    miniMapConfig: TMapConfig;
}

interface IUseTouchResult {
    eventListeners: {
        ontouchstart: (e: TouchEvent) => void;
        ontouchmove: (e: TouchEvent, mapType?: "MAIN" | "MINI") => void;
        ontouchend: () => void;
        ontouchcancel: () => void;
    };
}

const useTouch = ({
    setCoords,
    mainMapConfig,
    miniMapConfig,
}: IUseTouchProps): IUseTouchResult => {
    const [isTouching, setIsTouching] = useState(false);
    const [touchStartCoords, setTouchStartCoords] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const elementRef = useRef<DOMRect | null>(null);

    const getTouchCoords = useCallback((e: TouchEvent) => {
        if (!e.currentTarget || !e.touches[0]) return null;

        // Get element boundaries to calculate offsetX/Y
        if (!elementRef.current) {
            elementRef.current = (
                e.currentTarget as HTMLElement
            ).getBoundingClientRect();
        }

        // Calculate offset relative to the element
        const touch = e.touches[0];
        return {
            x: touch.clientX - elementRef.current.left,
            y: touch.clientY - elementRef.current.top,
        };
    }, []);

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            const touchCoords = getTouchCoords(e);
            if (touchCoords) {
                setIsTouching(true);
                setTouchStartCoords(touchCoords);
            }
            // Prevent default to avoid scroll/zoom on mobile
            e.preventDefault();
        },
        [getTouchCoords]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent, mapType: "MAIN" | "MINI" = "MAIN") => {
            if (isTouching && touchStartCoords) {
                const touchCoords = getTouchCoords(e);
                if (!touchCoords) return;

                const deltaX = touchCoords.x - touchStartCoords.x;
                const deltaY = touchCoords.y - touchStartCoords.y;

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

                // Update the touch start coordinates
                setTouchStartCoords(touchCoords);
            }
            // Prevent default to avoid scroll/zoom on mobile
            e.preventDefault();
        },
        [
            isTouching,
            touchStartCoords,
            mainMapConfig.scale,
            miniMapConfig.scale,
            setCoords,
            getTouchCoords,
        ]
    );

    const handleTouchEnd = useCallback(() => {
        setTouchStartCoords(null);
        setIsTouching(false);
        elementRef.current = null;
    }, []);

    const handleTouchCancel = useCallback(() => {
        setIsTouching(false);
        elementRef.current = null;
    }, []);

    const eventListeners = {
        ontouchstart: handleTouchStart,
        ontouchmove: handleTouchMove,
        ontouchend: handleTouchEnd,
        ontouchcancel: handleTouchCancel,
    };

    return {
        eventListeners,
    };
};

export default useTouch;
