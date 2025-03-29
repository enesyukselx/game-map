import { TCoords } from "../types";

const calculateDistance = (
    startingPoint: TCoords,
    destinationPoint: TCoords
): number => {
    const dx = destinationPoint.x - startingPoint.x;
    const dy = destinationPoint.y - startingPoint.y;

    return Math.sqrt(dx * dx + dy * dy);
};

export default calculateDistance;
