import express from "express";
import roomRoutes from "./src/routes/question.js";
import userRoutes from "./src/routes/user.js";

const app = express();
app.use(express.json());

app.use("/room", roomRoutes);
app.use("/user", userRoutes);

export default app;