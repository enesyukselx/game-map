import { useRef } from "react";
import useMap from "../hooks/useMap";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useResize from "../hooks/useResize";
import { MAIN_MAP_SIZE } from "../constants";
import useWheel from "../hooks/useWheel";

const MainMap = () => {
    //
    const {
        setMainMap,
        setMainMapConfig,
        eventListeners,
        touchEventListeners,
    } = useMap();
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
                touchAction: "none",
            }}
        >
            <canvas
                ref={canvasRef}
                // Mouse Events
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
                // Touch Events
                onTouchStart={(e) =>
                    touchEventListeners["ontouchstart"](e.nativeEvent)
                }
                onTouchMove={(e) =>
                    touchEventListeners["ontouchmove"](e.nativeEvent, "MAIN")
                }
                onTouchEnd={(e) =>
                    touchEventListeners["ontouchend"](e.nativeEvent)
                }
                onTouchCancel={(e) =>
                    touchEventListeners["ontouchcancel"](e.nativeEvent)
                }
            ></canvas>
        </div>
    );
};

export default MainMap;
