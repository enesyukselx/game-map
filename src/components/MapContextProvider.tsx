import { useEffect, useState } from "react";
import MapContext, { IMapContext } from "../context/MapContext";

const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
    //
    const [mainMap, setMainMap] = useState<
        CanvasRenderingContext2D | undefined
    >(undefined);

    const [miniMap, setMiniMap] = useState<
        CanvasRenderingContext2D | undefined
    >(undefined);

    const values: IMapContext = {
        mainMap,
        miniMap,
        setMainMap,
        setMiniMap,
    };

    useEffect(() => {
        //
        if (!mainMap || !miniMap) return;

        mainMap.fillStyle = "red";
        mainMap.fillRect(0, 0, 600, 600);

        miniMap.fillStyle = "green";
        miniMap.fillRect(0, 0, 300, 300);
    }, [miniMap, mainMap]);

    return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
};

export default MapContextProvider;
