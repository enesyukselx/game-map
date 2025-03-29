import { useRef } from "react";
import useMap from "../hooks/useMap";
import useResize from "../hooks/useResize";
import { MAIN_MAP_SIZE } from "../constants";
import useWheel from "../hooks/useWheel";
import useVillageHover from "../hooks/useVillageHover";
import VillageDetailsPopup from "./VillageDetailsPopup";
import { VILLAGES } from "../data/mapObjects";

const MainMap = () => {
    const {
        mainMapRef,
        mainMapConfig,
        setMainMapConfig,
        isDragging,
        eventListeners,
        touchEventListeners,
        coords,
    } = useMap();
    const wrapperRef = useRef<HTMLDivElement>(null);
    useResize(wrapperRef, setMainMapConfig);
    useWheel(mainMapRef, setMainMapConfig);

    // Use the village hover hook
    const { hoveredVillage, hoverPosition } = useVillageHover(
        mainMapRef,
        isDragging,
        VILLAGES,
        coords,
        mainMapConfig
    );

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
                position: "relative",
            }}
        >
            <canvas
                ref={mainMapRef}
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

            {hoveredVillage && hoverPosition && (
                <VillageDetailsPopup
                    village={hoveredVillage}
                    position={hoverPosition}
                />
            )}
        </div>
    );
};

export default MainMap;
