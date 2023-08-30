import express from "express";
import catalyst from "zcatalyst-sdk-node";

const router = express.Router();

router.post('/create', async (req, res) => {
    const { roomName, userName } = req.body;
    const app = catalyst.initialize(req);
    const roomResp = await app.datastore().table("Room").getPagedRows({ max_rows: 100 });
    let rooms = roomResp.data || [];
 
    const isValidRoom = rooms.find((room) => room.NAME === roomName) || null;
    if (!isValidRoom) { 
        return res.status(400).json({ error_code:"INVALID_INPUT", message: "Invalid room Id" });
    }
    const roomId = isValidRoom.ROWID;
   
    try {
        const userTable = await app.datastore().table("Leaderboard").insertRow({ ROOMID: roomId, USERNAME: userName });
        const data = { roomId, userId: userTable.ROWID, userName, roomName };
        return res.status(200).json({ data, status:"success" });
    } catch (err) {
        const isDuplicateNameError = err.status === 400 && err.error_code === 'DUPLICATE_VALUE';
        return res.status(400).json({ status:"failure", error_code: isDuplicateNameError ? "DUPLICATE_VALUE" : "UNKNOWN_ERROR", message: "Name already exists, Please give a unique name" });
    }
});

router.get('/:userId', async (req, res) => { 
    const { userId } = req.params;
    const app = catalyst.initialize(req);

    try {
        const leaderboard = await app.datastore().table("Leaderboard").getRow(userId);
        if (leaderboard) {
            const data = { roomId: leaderboard.ROOMID, userId: leaderboard.ROWID, userName: leaderboard.USERNAME, score: leaderboard.SCORE, level: leaderboard.LEVEL, createdAt: leaderboard.CREATEDTIME, updatedAt: leaderboard.MODIFIEDTIME };
            return res.status(200).json({ data, status:"success" }); 
        }
        return res.status(400).json({ status:"failure", error_code: "INVALID_INPUT", message: "Invalid user Id" });
    } catch (err) {
        return res.status(400).json({ status:"failure", error_code: "INVALID_INPUT", message: "Please check if the URL trying to access is a correct one" });
    }
})

router.put('/:userId/status', async (req, res) => {
    const { userId } = req.params;
    const { clickedTimer, level, secretKey } = req.body;
    const app = catalyst.initialize(req);

    const targetTimer = parseInt(level) * 100;

    const lowerLimit = parseFloat(targetTimer) - 5;
    const upperLimit = parseFloat(targetTimer) + 5;

    const timerDiff = Math.abs(targetTimer - clickedTimer);
    const intValue = parseInt(timerDiff);

    if (lowerLimit <= clickedTimer && upperLimit >= clickedTimer) { 
        const timerVsScore = {
            0: 10,
            1: 8,
            2: 6,
            3: 4,
            4: 2,
            5: 1
        };
    
        try {
            const previousData = await app.datastore().table("Leaderboard").getRow(userId);
            const previousScore = previousData.SCORE;
            const clickedScore = (parseInt(level) * 10) + timerVsScore[intValue];
            
            const data = { ROWID: userId, SCORE: clickedScore - 10, LEVEL: level };

            if (clickedScore === ((level + 1) * 10)) {
                let updatedData = await app.datastore().table("Leaderboard").updateRow({ ...data, LEVEL: parseInt(level) + 1 });
                updatedData = { score: updatedData.SCORE, level: updatedData.LEVEL, updatedAt: updatedData.MODIFIEDTIME, createdAt: updatedData.CREATEDTIME, userName: updatedData.USERNAME, userId: updatedData.ROWID, roomId: updatedData.ROOMID };
                res.status(200).json({ status: "success", data:updatedData});
            } else if (parseInt(previousScore) < parseInt(clickedScore)) {
                console.log("updating the value in db", clickedScore);
                let updatedData = await app.datastore().table("Leaderboard").updateRow(data);
                updatedData = { score: updatedData.SCORE, level: updatedData.LEVEL, updatedAt: updatedData.MODIFIEDTIME, createdAt: updatedData.CREATEDTIME, userName: updatedData.USERNAME, userId: updatedData.ROWID, roomId: updatedData.ROOMID };
                res.status(200).json({ status: "success", data:updatedData});
            } else {
                res.status(202).json({ status: "success", data: { message: "You have already reached high score in this level. Skipping this value" } });   
            }
        } catch (err) {
            return res.status(400).json({ status:"failure", error_code: "INTERNAL_SERVER_ERROR", message: "Unable to update the value in db, then clicker timer is comes under the range" });
        }
    } else {
        return res.status(202).json({ status: "success", data: { message: "Clicked time is not in the target range." } });
    }
 })

export default router;