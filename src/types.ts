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
};
