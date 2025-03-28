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
    type: "barbar" | "enemy" | "ally" | "unknown";
    point: number;
};

export type TTerrain = {
    coords: TCoords;
    type: "lake" | "mine" | "forest";
};

export type TMapType = "MAIN" | "MINI" | "POPUP";
