import { useRef } from "react";
import useMap from "../hooks/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";

const MainMap = () => {
    //
    const { setMainMap, eventListeners } = useMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasSetup(canvasRef, setMainMap);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={(e) => eventListeners["onmousedown"](e.nativeEvent)}
            onMouseMove={(e) =>
                eventListeners["onmousemove"](e.nativeEvent, "MAIN")
            }
            onMouseUp={(e) => eventListeners["onmouseup"](e.nativeEvent)}
            onMouseLeave={(e) => eventListeners["onmouseleave"](e.nativeEvent)}
        ></canvas>
    );
};

export default MainMap;
