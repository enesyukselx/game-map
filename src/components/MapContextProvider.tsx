import { useEffect, useRef, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import DATA from "../constants/data";
import { TCoords } from "../types";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useMapRendering from "../hooks/useMapRendering";
import { useDragging } from "../hooks/useDragging";
import { useTouch } from "../hooks/useTouch";
import { MAIN_MAP_SIZE, MINI_MAP_SIZE, POPUP_MAP_SIZE } from "../constants";

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
    //
    const [coords, setCoords] = useState<TCoords>({
        x: 0,
        y: 0,
    });

    const mainMapRef = useRef<HTMLCanvasElement>(null);
    const miniMapRef = useRef<HTMLCanvasElement>(null);
    const popupMapRef = useRef<HTMLCanvasElement>(null);

    const {
        map: mainMap,
        mapConfig: mainMapConfig,
        mapCtx: mainMapCtx,
        setMapConfig: setMainMapConfig,
    } = useCanvasSetup(mainMapRef, { size: MAIN_MAP_SIZE, scale: 50 });

    const {
        map: miniMap,
        mapConfig: miniMapConfig,
        mapCtx: miniMapCtx,
        setMapConfig: setMiniMapConfig,
    } = useCanvasSetup(miniMapRef, { size: MINI_MAP_SIZE, scale: 5 });

    const { mapConfig: popupMapConfig, mapCtx: popupMapCtx } = useCanvasSetup(
        popupMapRef,
        { size: POPUP_MAP_SIZE, scale: 0.8 }
    );

    // dragging event listeners with useDragging hook
    const { isDragging, eventListeners } = useDragging({
        setCoords,
        mainMapConfig,
        miniMapConfig,
    });

    const { eventListeners: touchEventListeners } = useTouch({
        setCoords,
        mainMapConfig,
        miniMapConfig,
    });

    // Change cursor style based on dragging state
    useEffect(() => {
        if (!mainMap || !miniMap) return;

        const cursorStyle = isDragging ? "move" : "default";
        mainMap.style.cursor = cursorStyle;
        miniMap.style.cursor = cursorStyle;
    }, [mainMap, miniMap, isDragging]);

    // Calculate visible area width and height for mini map
    const visibleAreaWidth =
        (mainMapConfig.size.width / mainMapConfig.scale) * miniMapConfig.scale;
    const visibleAreaHeight =
        (mainMapConfig.size.height / mainMapConfig.scale) * miniMapConfig.scale;

    // Render maps
    useMapRendering(mainMapCtx, mainMapConfig, "MAIN", DATA, coords);
    useMapRendering(miniMapCtx, miniMapConfig, "MINI", DATA, coords, {
        width: visibleAreaWidth,
        height: visibleAreaHeight,
    });
    useMapRendering(popupMapCtx, popupMapConfig, "POPUP", DATA, {
        x: 0,
        y: 0,
    });

    const values: IMapContext = {
        coords,
        setCoords,
        mainMapRef,
        miniMapRef,
        popupMapRef,
        mainMapConfig,
        setMainMapConfig,
        setMiniMapConfig,
        eventListeners,
        touchEventListeners,
    };

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
