import { useEffect, useRef } from "react";
import { useMapContext } from "../hook/useMap";

const MiniMap = () => {
    //
    const { setMiniMap } = useMapContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            setMiniMap(canvasRef.current);
        }
    }, [canvasRef, setMiniMap]);

    return <canvas ref={canvasRef}></canvas>;
};

export default MiniMap;
