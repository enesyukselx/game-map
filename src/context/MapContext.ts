import { createContext } from "react";

export interface IMapContext {
    coords: { x: number; y: number };
    setCoords: (coords: { x: number; y: number }) => void;
    mainMap: HTMLCanvasElement | undefined;
    setMainMap: (el: HTMLCanvasElement) => void;
    mainMapConfig: { size: { width: number; height: number }; scale: number };
    setMainMapConfig: (config: {
        size: { width: number; height: number };
        scale: number;
    }) => void;
    miniMap: HTMLCanvasElement | undefined;
    setMiniMap: (el: HTMLCanvasElement) => void;
    miniMapConfig: { size: { width: number; height: number }; scale: number };
    setMiniMapConfig: (config: {
        size: { width: number; height: number };
        scale: number;
    }) => void;
    eventListeners: {
        [key: string]: (e: MouseEvent) => void;
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
