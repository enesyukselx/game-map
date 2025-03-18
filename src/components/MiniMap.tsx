import { useRef } from "react";
import { useMapContext } from "../hook/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";

const MiniMap = () => {
    //
    const { setMiniMap, eventListeners } = useMapContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasSetup(canvasRef, setMiniMap);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={(e) => eventListeners["onmousedown"](e.nativeEvent)}
            onMouseMove={(e) =>
                eventListeners["onmousemove"](e.nativeEvent, "MINI")
            }
            onMouseUp={(e) => eventListeners["onmouseup"](e.nativeEvent)}
            onMouseLeave={(e) => eventListeners["onmouseleave"](e.nativeEvent)}
        ></canvas>
    );
};

export default MiniMap;
