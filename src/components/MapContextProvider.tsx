import { useEffect, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import DATA from "../constants/data";
import { clearMap } from "../utils/clearMap";

const MAP_BACKGROUND_COLOR = "#7bdb86";
const MAIN_MAP_SIZE = { width: 500, height: 500 };
const MINI_MAP_SIZE = { width: 300, height: 300 };
const VILLAGE_SIZE = 1;
const SCALE_MULTIPLIER = VILLAGE_SIZE * 2;

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
    //
    const [coords, setCoords] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [mainMap, setMainMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [mainMapConfig, setMainMapConfig] = useState<{
        size: { width: number; height: number };
        scale: number;
    }>({
        size: MAIN_MAP_SIZE,
        scale: 40,
    });

    const [mainMapCtx, setMainMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

    const [miniMap, setMiniMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [miniMapConfig, setMiniMapConfig] = useState<{
        size: { width: number; height: number };
        scale: number;
    }>({
        size: MINI_MAP_SIZE,
        scale: 5,
    });

    const [miniMapCtx, setMiniMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

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
    };

    useEffect(() => {
        //
        if (!mainMap || !miniMap) return;

        mainMap.width = mainMapConfig.size.width;
        mainMap.height = mainMapConfig.size.height;

        miniMap.width = miniMapConfig.size.width;
        miniMap.height = miniMapConfig.size.height;

        const mainMapCtx = mainMap.getContext("2d");
        const miniMapCtx = miniMap.getContext("2d");

        if (!mainMapCtx || !miniMapCtx) return;

        setMainMapCtx(mainMapCtx);
        setMiniMapCtx(miniMapCtx);
    }, [miniMap, mainMap, mainMapConfig.size, miniMapConfig.size]);

    useEffect(() => {
        if (!mainMapCtx || !miniMapCtx) return;

        // Clear previous drawings
        clearMap({
            ctx: mainMapCtx,
            width: mainMapConfig.size.width,
            height: mainMapConfig.size.height,
            backgroundColor: MAP_BACKGROUND_COLOR,
        });

        clearMap({
            ctx: miniMapCtx,
            width: miniMapConfig.size.width,
            height: miniMapConfig.size.height,
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

        DATA.forEach((village) => {
            miniMapCtx.fillStyle = "red";
            miniMapCtx.fillRect(
                (village.coords.x - coords.x) *
                    miniMapConfig.scale *
                    SCALE_MULTIPLIER +
                    miniMapCenterX,
                (village.coords.y - coords.y) *
                    miniMapConfig.scale *
                    SCALE_MULTIPLIER +
                    miniMapCenterY,
                VILLAGE_SIZE * miniMapConfig.scale,
                VILLAGE_SIZE * miniMapConfig.scale
            );
        });

        DATA.forEach((village) => {
            mainMapCtx.fillStyle = "red";
            mainMapCtx.fillRect(
                (village.coords.x - coords.x) *
                    mainMapConfig.scale *
                    SCALE_MULTIPLIER,
                (village.coords.y - coords.y) *
                    mainMapConfig.scale *
                    SCALE_MULTIPLIER,
                VILLAGE_SIZE * mainMapConfig.scale,
                VILLAGE_SIZE * mainMapConfig.scale
            );
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
        mainMapConfig.size,
        miniMapConfig.size,
        mainMapConfig.scale,
        miniMapConfig.scale,
    ]);

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
