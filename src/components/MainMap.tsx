import { useEffect, useRef } from "react";
import { useMapContext } from "../hook/useMap";

const MainMap = () => {
    //
    const { setMainMap } = useMapContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                setMainMap(context);
            }
        }
    }, [canvasRef, setMainMap]);

    return <canvas ref={canvasRef} width={600} height={600}></canvas>;
};

export default MainMap;
