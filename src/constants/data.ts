const DATA = [
    {
        name: "xxxx village",
        coords: {
            x: 0,
            y: 0,
        },
    },
    {
        name: "xxxx village",
        coords: {
            x: 0,
            y: 1,
        },
    },
    {
        name: "xxxx village",
        coords: {
            x: 1,
            y: 1,
        },
    },
];

for (let i = 0; i < 30000; i++) {
    DATA.push({
        name: `xxxx village ${i}`,
        coords: {
            x: Math.floor(Math.random() * 200) + 1,
            y: Math.floor(Math.random() * 200) + 1,
        },
    });
}

export default DATA;
