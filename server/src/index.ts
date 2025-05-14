import express from "express";

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});

app.use("/", (req, res) => {
    res.send("Hello World");
});

export default app;
