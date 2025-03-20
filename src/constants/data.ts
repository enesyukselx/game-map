import { TVillage } from "../types";

const DATA: TVillage[] = [];

for (let i = 0; i < 20000; i++) {
    const types = ["barbar", "enemy", "ally", "unknown"];
    const randomType = types[Math.floor(Math.random() * types.length)];

    DATA.push({
        name: `xxxx village ${i}`,
        coords: {
            x: Math.floor(Math.random() * 300) + 1,
            y: Math.floor(Math.random() * 300) + 1,
        },
        type: randomType as "barbar" | "enemy" | "ally" | "unknown",
    });
}

export default DATA;
