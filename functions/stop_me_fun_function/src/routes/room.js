import express from "express";

const router = express.Router();

router.get('/room', (req,res) => {
    res.status(200).json({ message: "pong room" });
});

export default router;