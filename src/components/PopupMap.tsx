import { useRef } from "react";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useMap from "../hooks/useMap";

const PopupMap = () => {
    //
    const { setPopupMap } = useMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasSetup(canvasRef, setPopupMap);

    return <canvas ref={canvasRef}></canvas>;
};

export default PopupMap;
