import { useEffect, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";
import DATA from "../constants/data";

const MAP_BACKGROUND_COLOR = "#7bdb86";
const MAIN_MAP_SIZE = { width: 500, height: 500 };
const MINI_MAP_SIZE = { width: 300, height: 300 };

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
    //
    const [coords, setCoords] = useState<{ x: number; y: number }>({
        x: 100,
        y: 100,
    });

    const [mainMap, setMainMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [mainMapConfig, setMainMapConfig] = useState<{
        size: { width: number; height: number };
        scale: number;
        villageSize: number;
    }>({
        size: MAIN_MAP_SIZE,
        scale: 1,
        villageSize: 40,
    });

    const [mainMapCtx, setMainMapCtx] =
        useState<CanvasRenderingContext2D | null>(null);

    const [miniMap, setMiniMap] = useState<HTMLCanvasElement | undefined>(
        undefined
    );

    const [miniMapConfig, setMiniMapConfig] = useState<{
        size: { width: number; height: number };
        scale: number;
        villageSize: number;
    }>({
        size: MINI_MAP_SIZE,
        scale: 10,
        villageSize: 5,
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
        mainMapCtx.clearRect(
            0,
            0,
            mainMapConfig.size.width,
            mainMapConfig.size.height
        );
        miniMapCtx.clearRect(
            0,
            0,
            miniMapConfig.size.width,
            miniMapConfig.size.height
        );

        // Redraw background
        mainMapCtx.fillStyle = MAP_BACKGROUND_COLOR;
        mainMapCtx.fillRect(
            0,
            0,
            mainMapConfig.size.width,
            mainMapConfig.size.height
        );

        miniMapCtx.fillStyle = MAP_BACKGROUND_COLOR;
        miniMapCtx.fillRect(
            0,
            0,
            miniMapConfig.size.width,
            miniMapConfig.size.height
        );

        DATA.forEach((village) => {
            miniMapCtx.fillStyle = "red";
            miniMapCtx.fillRect(
                (village.coords.x - coords.x) * 10,
                (village.coords.y - coords.y) * 10,
                MINI_MAP_VILLAGE_SIZE,
                MINI_MAP_VILLAGE_SIZE
            );
        });

        DATA.forEach((village) => {
            mainMapCtx.fillStyle = "red";
            mainMapCtx.fillRect(
                (village.coords.x - coords.x) * 100,
                (village.coords.y - coords.y) * 100,
                MAIN_MAP_VILLAGE_SIZE,
                MAIN_MAP_VILLAGE_SIZE
            );
        });
    }, [
        coords,
        mainMapCtx,
        miniMapCtx,
        mainMapConfig.size,
        miniMapConfig.size,
    ]);

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
