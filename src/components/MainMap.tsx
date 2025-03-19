import { useRef } from "react";
import useMap from "../hooks/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useResize from "../hooks/useResize";
import { MAIN_MAP_SIZE } from "../constants";
import useWheel from "../hooks/useWhell";

const MainMap = () => {
    //
    const { setMainMap, setMainMapConfig, eventListeners } = useMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useCanvasSetup(canvasRef, setMainMap);
    useResize(wrapperRef, setMainMapConfig);
    useWheel(canvasRef, setMainMapConfig);

    return (
        <div
            className="canvas-wrapper"
            ref={wrapperRef}
            style={{
                minWidth: "250px",
                minHeight: "250px",
                width: MAIN_MAP_SIZE.width,
                height: MAIN_MAP_SIZE.height,
            }}
        >
            <canvas
                ref={canvasRef}
                onMouseDown={(e) =>
                    eventListeners["onmousedown"](e.nativeEvent)
                }
                onMouseMove={(e) =>
                    eventListeners["onmousemove"](e.nativeEvent, "MAIN")
                }
                onMouseUp={(e) => eventListeners["onmouseup"](e.nativeEvent)}
                onMouseLeave={(e) =>
                    eventListeners["onmouseleave"](e.nativeEvent)
                }
            ></canvas>
        </div>
    );
};

export default MainMap;
