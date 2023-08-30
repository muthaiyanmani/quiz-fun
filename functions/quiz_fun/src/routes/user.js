import express from "express";
import catalyst from "zcatalyst-sdk-node";

const router = express.Router();

router.post('/create', async (req, res) => {
   
    const { roomName, userName } = req.body;
    const app = catalyst.initialize(req, { scope:"admin" });

    let rooms = [];
    try {
        const roomResp = await app.datastore().table("Rooms").getPagedRows({ max_rows: 100 });
        rooms = roomResp.data || [];
    } catch (err) {
        console.log(err);
    }

    const isValidRoom = rooms.find((room) => room.NAME === roomName) || null;
    if (!isValidRoom) { 
        return res.status(400).json({ status:"failure", message: "Invalid room Id" });
    }
    const roomId = isValidRoom.ROWID;
   
    try {
        const userTable = await app.datastore().table("Players").insertRow({ ROOMID: roomId, NAME: userName });
        const data = { roomId, userId: userTable.ROWID, userName, roomName };
        return res.status(200).json({ data, status:"success" });
    } catch (err) {
        console.log(err);
        const isDuplicateNameError = err.status === 400 && err.error_code === 'DUPLICATE_VALUE';
        return res.status(400).json({ status:"failure", error_code: isDuplicateNameError ? "DUPLICATE_VALUE" : "UNKNOWN_ERROR", message: "Name already exists, Please give a unique name" });
    }
});

router.get('/:userId', async (req, res) => { 
    const { userId } = req.params;
    const app = catalyst.initialize(req, { scope: "admin"});

    try {
        const leaderboard = await app.datastore().table("Players").getRow(userId);
        if (leaderboard) {
            const data = { roomId: leaderboard.ROOMID, userId: leaderboard.ROWID, userName: leaderboard.NAME, score: leaderboard.SCORE, createdAt: leaderboard.CREATEDTIME, updatedAt: leaderboard.MODIFIEDTIME };
            return res.status(200).json({ data, status:"success" }); 
        }
        return res.status(400).json({ status:"failure", error_code: "INVALID_INPUT", message: "Invalid user Id" });
    } catch (err) {
        return res.status(400).json({ status:"failure", error_code: "INVALID_INPUT", message: "Please check if the URL trying to access is a correct one" });
    }
})

export default router;