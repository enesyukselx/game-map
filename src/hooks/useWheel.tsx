import { useEffect } from "react";
import { TMapConfig } from "../types";

const useWheel = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setMapConfig: React.Dispatch<React.SetStateAction<TMapConfig>>
) => {
    //
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            console.log(e);
            // You can also call your zoom/pan logic here
            setMapConfig((prev: TMapConfig) => {
                return {
                    ...prev,
                    scale: Math.min(
                        100,
                        Math.max(1, prev.scale - e.deltaY / 100)
                    ),
                };
            });
        };

        // Add non-passive wheel event listener
        canvas.addEventListener("wheel", handleWheel, { passive: false });

        // Clean up the event listener when component unmounts
        return () => {
            canvas.removeEventListener("wheel", handleWheel);
        };
        /* eslint-disable-next-line */
    }, [canvasRef]);
};

export default useWheel;
