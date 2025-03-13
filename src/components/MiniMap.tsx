import { useEffect, useRef } from "react";
import { useMapContext } from "../hook/useMap";

const MiniMap = () => {
    //
    const { setMiniMap } = useMapContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                setMiniMap(context);
            }
        }
    }, [canvasRef, setMiniMap]);

    return <canvas ref={canvasRef} width={300} height={300}></canvas>;
};

export default MiniMap;
