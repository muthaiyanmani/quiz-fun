import express from "express";
import roomRoutes from "./src/routes/question.js";

const app = express();
app.use(express.json());

app.use("/room", roomRoutes);

export default app;