import { useEffect, useState } from "react";
import { TMapConfig } from "../types";

const useCanvasSetup = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    config: TMapConfig
) => {
    //
    const [map, setMap] = useState<HTMLCanvasElement | undefined>(undefined);

    const [mapConfig, setMapConfig] = useState<TMapConfig>(config);

    const [mapCtx, setMapCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            setMap(canvasRef.current);
        }
    }, [canvasRef, setMap]);

    useEffect(() => {
        if (map) {
            const ctx = map.getContext("2d");
            if (ctx) {
                setMapCtx(ctx);
            }
        }
    }, [map, setMapCtx]);

    useEffect(() => {
        if (map) {
            map.width = mapConfig.size.width;
            map.height = mapConfig.size.height;
        }
    }, [map, mapConfig]);

    return { map, mapConfig, mapCtx, setMapConfig };
};

export default useCanvasSetup;
