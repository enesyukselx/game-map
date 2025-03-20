import { useEffect, useRef, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import DATA from "../constants/data";
import { clearMap } from "../utils/clearMap";
import { drawVillagesOnMap } from "../utils/drawVillagesOnMap";
import { drawCoordsOnMap } from "../utils/drawCoordsOnMap";
import { TCoords } from "../types";
import { useDragging } from "../hooks/useDragging";
import { useTouch } from "../hooks/useTouch";
import {
    MAIN_MAP_SIZE,
    MAP_BACKGROUND_COLOR,
    MINI_MAP_SIZE,
    POPUP_MAP_SIZE,
} from "../constants";
import useCanvasSetup from "../hooks/useCanvasSetup";

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

    useEffect(() => {
        if (!mainMapCtx || !miniMapCtx || !popupMapCtx) return;

        // Clear MainMap
        clearMap({
            ctx: mainMapCtx,
            width: mainMapConfig.size.width,
            height: mainMapConfig.size.height,
            backgroundColor: MAP_BACKGROUND_COLOR,
        });

        // Clear MiniMap
        clearMap({
            ctx: miniMapCtx,
            width: miniMapConfig.size.width,
            height: miniMapConfig.size.height,
            backgroundColor: MAP_BACKGROUND_COLOR,
        });

        // Clear PopupMap
        clearMap({
            ctx: popupMapCtx,
            width: popupMapConfig.size.width,
            height: popupMapConfig.size.height,
            backgroundColor: MAP_BACKGROUND_COLOR,
        });

        const visibleAreaWidth =
            (mainMapConfig.size.width / mainMapConfig.scale) *
            miniMapConfig.scale;
        const visibleAreaHeight =
            (mainMapConfig.size.height / mainMapConfig.scale) *
            miniMapConfig.scale;

        const miniMapCenterX =
            miniMapConfig.size.width / 2 - visibleAreaWidth / 2;
        const miniMapCenterY =
            miniMapConfig.size.height / 2 - visibleAreaHeight / 2;

        // Draw villages on main map
        drawVillagesOnMap({
            ctx: mainMapCtx,
            villages: DATA,
            coords,
            mapType: "MAIN",
            mapConfig: mainMapConfig,
        });

        drawCoordsOnMap({
            ctx: mainMapCtx,
            coords,
            mapConfig: mainMapConfig,
        });

        // Draw villages on mini map
        drawVillagesOnMap({
            ctx: miniMapCtx,
            villages: DATA,
            coords,
            mapType: "MINI",
            miniMapCenterCoords: { x: miniMapCenterX, y: miniMapCenterY },
            mapConfig: miniMapConfig,
        });

        drawVillagesOnMap({
            ctx: popupMapCtx,
            villages: DATA,
            coords: { x: 0, y: 0 },
            mapType: "POPUP",
            mapConfig: popupMapConfig,
        });

        miniMapCtx.strokeStyle = "black";
        miniMapCtx.lineWidth = 1;

        // Draw viewport rectangle on mini map
        miniMapCtx.strokeRect(
            miniMapCenterX,
            miniMapCenterY,
            visibleAreaWidth,
            visibleAreaHeight
        );
    }, [
        coords,
        mainMapCtx,
        miniMapCtx,
        popupMapCtx,
        mainMapConfig,
        miniMapConfig,
        popupMapConfig,
    ]);

    const values: IMapContext = {
        coords,
        setCoords,
        mainMapRef,
        miniMapRef,
        popupMapRef,
        setMainMapConfig,
        setMiniMapConfig,
        eventListeners,
        touchEventListeners,
    };

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
