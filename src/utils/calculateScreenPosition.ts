import { VILLAGE_SIZE } from "../constants";

export const calculateScreenPosition = (
    objectCoords: { x: number; y: number },
    viewportCoords: { x: number; y: number },
    scale: number
) => {
    return {
        x: (objectCoords.x - viewportCoords.x) * scale,
        y: (objectCoords.y - viewportCoords.y) * scale,
        size: VILLAGE_SIZE * scale,
    };
};
