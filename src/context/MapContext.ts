import { createContext } from "react";

export interface IMapContext {
    mainMap: CanvasRenderingContext2D | undefined;
    miniMap: CanvasRenderingContext2D | undefined;
    setMainMap: (el: CanvasRenderingContext2D) => void;
    setMiniMap: (el: CanvasRenderingContext2D) => void;
}

const MapContext = createContext<IMapContext>({
    mainMap: undefined,
    miniMap: undefined,
    setMainMap: () => {},
    setMiniMap: () => {},
});

export default MapContext;
