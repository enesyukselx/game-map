import { useEffect, useRef } from "react";
import { useMapContext } from "../hook/useMap";

const MainMap = () => {
    //
    const { setMainMap } = useMapContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            setMainMap(canvasRef.current);
        }
    }, [canvasRef, setMainMap]);

    return <canvas ref={canvasRef}></canvas>;
};

export default MainMap;
