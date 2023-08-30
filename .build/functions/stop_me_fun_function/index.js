import express from "express";
import roomRoutes from "./src/routes/room.js";
import playerRoutes from "./src/routes/player.js";

const app = express();
app.use(express.json());

app.use("/room", roomRoutes);
app.use("/player", playerRoutes);

export default app;