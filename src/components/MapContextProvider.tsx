import { useEffect, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import DATA from "../constants/data";
import { clearMap } from "../utils/clearMap";
import { drawVillagesOnMap } from "../utils/drawVillagesOnMap";
import { drawCoordsOnMap } from "../utils/drawCoordsOnMap";
import { TCoords, TMapConfig } from "../types";
import { useDragging } from "../hooks/useDragging";
import { useTouch } from "../hooks/useTouch";
import {
    MAIN_MAP_SIZE,
    MAP_BACKGROUND_COLOR,
    MINI_MAP_SIZE,
    POPUP_MAP_SIZE,
} from "../constants";

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
    //
    const [coords, setCoords] = useState<TCoords>({
        x: 0,
        y: 0,
    });

    const [mainMap, setMainMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [mainMapConfig, setMainMapConfig] = useState<TMapConfig>({
        size: MAIN_MAP_SIZE,
        scale: 50,
    });

    const [mainMapCtx, setMainMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

    const [miniMap, setMiniMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [miniMapConfig, setMiniMapConfig] = useState<TMapConfig>({
        size: MINI_MAP_SIZE,
        scale: 5,
    });

    const [miniMapCtx, setMiniMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

    const [popupMap, setPopupMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [popupMapConfig, setPopupMapConfig] = useState<TMapConfig>({
        size: POPUP_MAP_SIZE,
        scale: 0.8,
    });

    const [popupMapCtx, setPopupMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

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
        //
        if (!mainMap || !miniMap || !popupMap) return;

        mainMap.width = mainMapConfig.size.width;
        mainMap.height = mainMapConfig.size.height;

        miniMap.width = miniMapConfig.size.width;
        miniMap.height = miniMapConfig.size.height;

        popupMap.width = popupMapConfig.size.width;
        popupMap.height = popupMapConfig.size.height;

        const mainMapCtx = mainMap.getContext("2d");
        const miniMapCtx = miniMap.getContext("2d");
        const popupMapCtx = popupMap.getContext("2d");

        if (!mainMapCtx || !miniMapCtx || !popupMapCtx) return;

        setMainMapCtx(mainMapCtx);
        setMiniMapCtx(miniMapCtx);
        setPopupMapCtx(popupMapCtx);
    }, [
        miniMap,
        mainMap,
        popupMap,
        mainMapConfig.size,
        miniMapConfig.size,
        popupMapConfig.size,
    ]);

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
        mainMap,
        setMainMap,
        mainMapConfig,
        setMainMapConfig: (config) => {
            setMainMapConfig(config);
        },
        miniMap,
        miniMapConfig,
        setMiniMapConfig: (config) => {
            setMiniMapConfig(config);
        },
        setMiniMap,
        popupMap,
        setPopupMap,
        popupMapConfig,
        setPopupMapConfig,
        eventListeners,
        touchEventListeners,
    };

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
