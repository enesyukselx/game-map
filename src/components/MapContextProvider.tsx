import { useEffect, useRef, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import { TCoords } from "../types";
import useCanvasSetup from "../hooks/useCanvasSetup";
import useMapRendering from "../hooks/useMapRendering";
import useDragging from "../hooks/useDragging";
import useTouch from "../hooks/useTouch";
import {
    MAIN_MAP_SCALE,
    MAIN_MAP_SIZE,
    MINI_MAP_SCALE,
    MINI_MAP_SIZE,
    POPUP_MAP_SCALE,
    POPUP_MAP_SIZE,
} from "../constants";
import { TERRAINS, VILLAGES } from "../data/mapObjects";

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
    } = useCanvasSetup(mainMapRef, {
        size: MAIN_MAP_SIZE,
        scale: MAIN_MAP_SCALE,
    });

    const {
        map: miniMap,
        mapConfig: miniMapConfig,
        mapCtx: miniMapCtx,
        setMapConfig: setMiniMapConfig,
    } = useCanvasSetup(miniMapRef, {
        size: MINI_MAP_SIZE,
        scale: MINI_MAP_SCALE,
    });

    const { mapConfig: popupMapConfig, mapCtx: popupMapCtx } = useCanvasSetup(
        popupMapRef,
        { size: POPUP_MAP_SIZE, scale: POPUP_MAP_SCALE }
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
    useMapRendering(
        mainMapCtx,
        mainMapConfig,
        "MAIN",
        VILLAGES,
        TERRAINS,
        coords
    );
    useMapRendering(
        miniMapCtx,
        miniMapConfig,
        "MINI",
        VILLAGES,
        TERRAINS,
        coords,
        {
            width: visibleAreaWidth,
            height: visibleAreaHeight,
        }
    );
    useMapRendering(popupMapCtx, popupMapConfig, "POPUP", VILLAGES, TERRAINS, {
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
        isDragging,
        eventListeners,
        touchEventListeners,
    };

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
