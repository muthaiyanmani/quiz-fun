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

// router.put('/:roomId/question/:questionId/update', async (req, res) => { 
//     const app = catalyst.initialize(req, { scope: "admin" });
//     try {
//         const cache = await app.cache().segment().update('CurrentQuestionId', req.params.questionId);
//         res.status(200).json({ status:"success", message: "Question updated successfully." });
//     }catch(err) { 
//         res.status(500).json({ status:"failure", message: "Error in updating questionID in cache." });
//     }

// })

router.get('/:roomId/user/:userId/question/current', async (req, res) => {
    const app = catalyst.initialize(req);
    const { roomId, userId } = req.params;

    const query = `SELECT Questions.ROWID,Questions.OPTION_A,Questions.OPTION_B,Questions.OPTION_C,Questions.OPTION_D,Questions.QUESTION,Rooms.ISCOMPLETED FROM Questions INNER JOIN Rooms ON Questions.ROOMID = Rooms.ROWID WHERE Questions.ROOMID =${roomId} AND Questions.ISACTIVE = true;`;
    try {
        const question = await app.zcql().executeZCQLQuery(query) || [];  
        if (question.length) {
            const data = question.map((question) => ({ id: question.Questions.ROWID, question: question.Questions.QUESTION, optionA: question.Questions.OPTION_A, optionB: question.Questions.OPTION_B, optionC: question.Questions.OPTION_C, optionD: question.Questions.OPTION_D, isRoomEnded: question.Rooms.ISCOMPLETED }));
            // Checking if the user already answered the question
            const answerQuery = `SELECT ROWID FROM AnsweredQuiz WHERE PLAYERID=${userId} AND QUESTIONID=${data[0]?.id}`;
            const answer = await app.zcql().executeZCQLQuery(answerQuery);
            if (answer.length) {
                return res.status(202).json({ status: "success", message: "Question has been answered. Waiting for next question." });
            }
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

router.post('/:roomId/question/:questionId/quiz', async (req, res) => { 
    const app = catalyst.initialize(req, { scope:"admin"});
    const { roomId, questionId } = req.params;
    const { answer, userId } = req.body;

   
    try {
        const query = `SELECT ROWID,NOOFPEOPLE FROM Answers WHERE QUESTIONID=${questionId} AND ANSWER='${answer}'`;
        const answerTableData = await app.zcql().executeZCQLQuery(query);
        const answerTableRowId = answerTableData[0]?.Answers?.ROWID;
        const noOfPeople = answerTableData[0]?.Answers?.NOOFPEOPLE;

        await app.datastore().table("AnsweredQuiz").insertRow({ PLAYERID: userId, QUESTIONID: questionId, ANSWERID: answerTableRowId });
        await app.datastore().table("Answers").updateRow({ ROWID:answerTableRowId, NOOFPEOPLE: parseInt(noOfPeople) + 1 });
        return res.status(202).json({ status: "success", message: "Question has been answered. Waiting for next question." });
    } catch (err) { 
        console.log(err);
        res.status(500).json({ status:"failure", message: "Error in saving answer." });
    }
})

export default router;