import { useRef } from "react";
import useMap from "../hooks/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useResize from "../hooks/useResize";
import { MINI_MAP_SIZE } from "../constants";

const MiniMap = () => {
    //
    const { setMiniMap, setMiniMapConfig, eventListeners } = useMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useCanvasSetup(canvasRef, setMiniMap);
    useResize(wrapperRef, setMiniMapConfig);

    return (
        <div
            className="canvas-wrapper"
            ref={wrapperRef}
            style={{
                minWidth: "150px",
                minHeight: "150px",
                width: MINI_MAP_SIZE.width,
                height: MINI_MAP_SIZE.height,
            }}
        >
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
