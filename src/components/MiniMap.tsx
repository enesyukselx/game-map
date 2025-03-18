import { useRef } from "react";
import useMap from "../hooks/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";

const MiniMap = () => {
    //
    const { setMiniMap, eventListeners } = useMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useCanvasSetup(canvasRef, setMiniMap);

    return (
        <div className="canvas-wrapper">
            <canvas
                ref={canvasRef}
                onMouseDown={(e) =>
                    eventListeners["onmousedown"](e.nativeEvent)
                }
                onMouseMove={(e) =>
                    eventListeners["onmousemove"](e.nativeEvent, "MINI")
                }
                onMouseUp={(e) => eventListeners["onmouseup"](e.nativeEvent)}
                onMouseLeave={(e) =>
                    eventListeners["onmouseleave"](e.nativeEvent)
                }
            ></canvas>
        </div>
    );
};

export default MiniMap;
