import { useEffect } from "react";

const useCanvasSetup = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    setCanvas: (el: HTMLCanvasElement) => void
) => {
    //
    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            setCanvas(canvasRef.current);
        }
    }, [canvasRef, setCanvas]);
};

export default useCanvasSetup;
