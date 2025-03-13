import { createContext } from "react";

export interface IMapContext {
  mainMapRef: React.RefObject<HTMLCanvasElement> | undefined;
  miniMapRef: React.RefObject<HTMLCanvasElement> | undefined;
}

const MapContext = createContext<IMapContext>({
  mainMapRef: undefined,
  miniMapRef: undefined,
});

export default MapContext;
