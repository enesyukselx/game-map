export type TMapConfig = {
    size: {
        width: number;
        height: number;
    };
    scale: number;
};

export type TCoords = {
    x: number;
    y: number;
};

export type TVillage = {
    name: string;
    coords: TCoords;
    type: TVillageTypes;
    point: number;
};

export type TTerrain = {
    coords: TCoords;
    type: "lake" | "mine" | "forest";
};

export type TVillageTypes = "barbar" | "enemy" | "ally" | "unknown";
export type TMapType = "MAIN" | "MINI" | "POPUP";
