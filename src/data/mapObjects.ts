import { type TVillage, type TTerrain } from "../types";

export const TERRAINS: TTerrain[] = [];
export const VILLAGES: TVillage[] = [];

// Generate terrains
for (let i = 0; i < 500; i++) {
    const types = ["lake", "mine", "forest"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const randomX = Math.floor(Math.random() * 50) + 1;
    const randomY = Math.floor(Math.random() * 50) + 1;

    // Ensure the terrain coordinates are unique
    const isUnique = TERRAINS.every(
        (terrain) =>
            terrain.coords.x !== randomX || terrain.coords.y !== randomY
    );

    if (!isUnique) continue;

    TERRAINS.push({
        coords: {
            x: randomX,
            y: randomY,
        },
        type: randomType as "lake" | "mine" | "forest",
    });
}

// Generate villages
for (let i = 0; i < 1000; i++) {
    const types = ["barbar", "enemy", "ally", "unknown"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const randomX = Math.floor(Math.random() * 50) + 1;
    const randomY = Math.floor(Math.random() * 50) + 1;
    // Ensure the village coordinates are unique
    const isUnique = VILLAGES.every(
        (village) =>
            village.coords.x !== randomX || village.coords.y !== randomY
    );
    if (!isUnique) continue;
    // Ensure the village coordinates are not on a terrain
    const isOnTerrain = TERRAINS.some(
        (terrain) =>
            terrain.coords.x === randomX && terrain.coords.y === randomY
    );
    if (isOnTerrain) continue;

    VILLAGES.push({
        name: `xxxx village ${i}`,
        coords: {
            x: randomX,
            y: randomY,
        },
        point: Math.floor(Math.random() * 10000) + 1,
        type: randomType as "barbar" | "enemy" | "ally" | "unknown",
    });
}
