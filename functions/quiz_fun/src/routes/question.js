import express from "express";
import catalyst from "zcatalyst-sdk-node";

const router = express.Router();

router.get('/:roomId/questions',async (req, res) => {
    const app = catalyst.initialize(req);
    const { roomId } = req.params;
    const query = `SELECT ROWID,QUESTION,OPTION_A,OPTION_B,OPTION_C,OPTION_D FROM Questions WHERE ROOMID=${roomId}`;
    try {
        const questions = await app.zcql().executeZCQLQuery(query);
        let data = questions?.map((question) => question.Questions);
        data = data.map((quest) => ({id: quest.ROWID, question: quest.QUESTION, optionA : quest.OPTION_A, optionB: quest.OPTION_B, optionC: quest.OPTION_C, optionD: quest.OPTION_D }))
        res.status(200).json({ status:"success", data });
    } catch (err) { 
        res.status(500).json({ message: "Error in getting questions" });
    }
});

router.get('/:roomId/question/current', async (req, res) => {
    const app = catalyst.initialize(req);
    const { roomId } = req.params;
    const query = `SELECT ROWID,QUESTION,OPTION_A,OPTION_B,OPTION_C,OPTION_D FROM Questions WHERE ROOMID=${roomId} AND ISACTIVE=true`;
    try {
        const question = await app.zcql().executeZCQLQuery(query);
        let data = question?.map((question) => question.Questions);
        if (data.length) {
            data = data.map((quest) => ({ id: quest.ROWID, question: quest.QUESTION, optionA: quest.OPTION_A, optionB: quest.OPTION_B, optionC: quest.OPTION_C, optionD: quest.OPTION_D }));
            return res.status(200).json({ status: "success", data: data[0] });
        } else {
            return res.status(404).json({ status:"failure", message: "No current active questions." });
        }
    } catch (err) { 
        res.status(500).json({ status:"failure", message: "Error in getting options." });
    }
});

router.get('/:roomId/question/:questionId',async (req, res) => {
    const app = catalyst.initialize(req);
    const { roomId, questionId } = req.params;
    const query = `SELECT QUESTION,OPTION_A,OPTION_B,OPTION_C,OPTION_D FROM Questions WHERE ROWID=${questionId}`;
    try {
        const question = await app.zcql().executeZCQLQuery(query);
        let data = question?.map((question) => question.Questions);
        if (data.length) {
            data = data.map((quest) => ({ id: questionId, question: quest.QUESTION, optionA: quest.OPTION_A, optionB: quest.OPTION_B, optionC: quest.OPTION_C, optionD: quest.OPTION_D }));
            return res.status(200).json({ status: "success", data: data[0] });
        } else {
            return res.status(404).json({ status:"failure", message: "Question not found." });
        }
    } catch (err) { 
        res.status(500).json({ status:"failure", message: "Error in getting question." });
    }
});

export default router;