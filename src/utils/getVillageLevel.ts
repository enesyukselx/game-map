const getVillageLevel = (point: number) => {
    if (point > 9000) return 6;
    if (point > 6000) return 5;
    if (point > 3000) return 4;
    if (point > 2000) return 3;
    if (point > 1000) return 2;
    if (point > 0) return 1;
    return 1;
};

export default getVillageLevel;
