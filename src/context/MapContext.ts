import { createContext, createRef } from "react";
import { TCoords, TMapConfig } from "../types";

export interface IMapContext {
    coords: TCoords;
    setCoords: (coords: TCoords) => void;
    mainMapRef: React.RefObject<HTMLCanvasElement | null>;
    miniMapRef: React.RefObject<HTMLCanvasElement | null>;
    popupMapRef: React.RefObject<HTMLCanvasElement | null>;
    mainMapConfig: TMapConfig;
    setMainMapConfig: React.Dispatch<React.SetStateAction<TMapConfig>>;
    setMiniMapConfig: React.Dispatch<React.SetStateAction<TMapConfig>>;
    eventListeners: {
        [key: string]: (e: MouseEvent, mapType?: "MAIN" | "MINI") => void;
    };
    touchEventListeners: {
        [key: string]: (e: TouchEvent, mapType?: "MAIN" | "MINI") => void;
    };
}

const MapContext = createContext<IMapContext>({
    coords: { x: 0, y: 0 },
    setCoords: () => {},
    mainMapRef: createRef<HTMLCanvasElement>(),
    miniMapRef: createRef<HTMLCanvasElement>(),
    popupMapRef: createRef<HTMLCanvasElement>(),
    mainMapConfig: {
        size: { width: 0, height: 0 },
        scale: 0,
    },
    setMainMapConfig: () => {},
    setMiniMapConfig: () => {},
    eventListeners: {},
    touchEventListeners: {},
});

export default MapContext;
