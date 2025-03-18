import { createContext } from "react";
import { TCoords, TMapConfig } from "../types";

export interface IMapContext {
    coords: TCoords;
    setCoords: (coords: TCoords) => void;
    mainMap: HTMLCanvasElement | undefined;
    setMainMap: (el: HTMLCanvasElement) => void;
    mainMapConfig: TMapConfig;
    setMainMapConfig: (config: TMapConfig) => void;
    miniMap: HTMLCanvasElement | undefined;
    setMiniMap: (el: HTMLCanvasElement) => void;
    miniMapConfig: TMapConfig;
    setMiniMapConfig: (config: TMapConfig) => void;
    eventListeners: {
        [key: string]: (e: MouseEvent, mapType?: "MAIN" | "MINI") => void;
    };
}

const MapContext = createContext<IMapContext>({
    coords: { x: 0, y: 0 },
    setCoords: () => {},
    mainMap: undefined,
    setMainMap: () => {},
    mainMapConfig: { size: { width: 0, height: 0 }, scale: 1 },
    setMainMapConfig: () => {},
    miniMap: undefined,
    setMiniMap: () => {},
    miniMapConfig: { size: { width: 0, height: 0 }, scale: 1 },
    setMiniMapConfig: () => {},
    eventListeners: {},
});

export default MapContext;
