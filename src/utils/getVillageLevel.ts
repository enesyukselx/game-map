const getVillageLevel = (point: number) => {
    switch (true) {
        case point > 9000:
            return 6;
        case point > 6000:
            return 5;
        case point > 3000:
            return 4;
        case point > 2000:
            return 3;
        case point > 1000:
            return 2;
        default:
            return 1;
    }
};

export default getVillageLevel;
