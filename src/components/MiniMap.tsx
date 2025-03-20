import { useRef } from "react";
import useMap from "../hooks/useMap";
import useResize from "../hooks/useResize";
import { MINI_MAP_SIZE } from "../constants";

const MiniMap = () => {
    //
    const {
        miniMapRef,
        setMiniMapConfig,
        eventListeners,
        touchEventListeners,
    } = useMap();
    const wrapperRef = useRef<HTMLDivElement>(null);

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
                touchAction: "none",
            }}
        >
            <canvas
                ref={miniMapRef}
                // Mouse Events
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
                // Touch Events
                onTouchStart={(e) =>
                    touchEventListeners["ontouchstart"](e.nativeEvent)
                }
                onTouchMove={(e) =>
                    touchEventListeners["ontouchmove"](e.nativeEvent, "MINI")
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

export default MiniMap;
