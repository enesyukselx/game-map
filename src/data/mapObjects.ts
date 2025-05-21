import { type TVillage, type TTerrain } from "../types";

export const TERRAINS: TTerrain[] = [];
export const VILLAGES: TVillage[] = [];

// Helper function to generate unique coordinates
function generateUniqueCoordinates(
    mapSize: number,
    existingElements: Array<{ coords: { x: number; y: number } }>,
    restrictedElements?: Array<{ coords: { x: number; y: number } }>
): { x: number; y: number } {
    let randomX: number;
    let randomY: number;
    let isStillNotUnique: boolean;

    do {
        const centerX = 0; // Map center is (0,0)
        const centerY = 0; // Map center is (0,0)
        const maxRadius = mapSize / 2; // mapSize is the diameter

        const angle = Math.random() * 2 * Math.PI;
        const r = maxRadius * Math.sqrt(Math.random()); // r is between 0 and maxRadius

        let tempX = Math.round(centerX + r * Math.cos(angle)); // Coordinates are relative to (0,0)
        let tempY = Math.round(centerY + r * Math.sin(angle)); // Coordinates are relative to (0,0)

        // No clamping to [1, mapSize] needed as coordinates can be negative
        // and are naturally bounded by maxRadius around (0,0).

        randomX = tempX;
        randomY = tempY;

        const isUniqueAmongExisting = existingElements.every(
            (element) =>
                element.coords.x !== randomX || element.coords.y !== randomY
        );

        let isOnRestricted = false;
        if (restrictedElements) {
            isOnRestricted = restrictedElements.some(
                (element) =>
                    element.coords.x === randomX && element.coords.y === randomY
            );
        }

        isStillNotUnique = !isUniqueAmongExisting || isOnRestricted;
    } while (isStillNotUnique);

    return { x: randomX, y: randomY };
}

// Generate terrains
const terrainMapSize = 110; // Defines the max coordinate for terrains
for (let i = 0; i < 500; i++) {
    const types = ["lake", "mine", "forest"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    // Attempt to generate unique coordinates for terrain
    // If TERRAINS becomes too dense, this could loop many times or fail to add 500.
    // For simplicity, we assume it's possible to find a spot.
    const coords = generateUniqueCoordinates(terrainMapSize, TERRAINS);

    TERRAINS.push({
        coords: coords,
        type: randomType as "lake" | "mine" | "forest",
    });
}

// Generate villages
const villageMapSize = 110; // Define the map size for villages
for (let i = 0; i < 2000; i++) {
    const types = ["barbar", "enemy", "ally", "unknown"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    // Attempt to generate unique coordinates for village, avoiding terrains
    // Similar to terrains, assumes a spot can be found.
    const coords = generateUniqueCoordinates(
        villageMapSize,
        VILLAGES,
        TERRAINS
    );

    VILLAGES.push({
        name: `xxxx village ${i}`,
        coords: coords,
        point: Math.floor(Math.random() * 10000) + 1,
        type: randomType as "barbar" | "enemy" | "ally" | "unknown",
    });
}
