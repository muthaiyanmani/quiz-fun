import axios from "axios";

const createPlayer = async (reqBody) => { 
   return await axios.post("/server/quiz_fun/user/create", reqBody);
}

const getPlayerDetails = async (userId) => { 
    return await axios.get(`/server/quiz_fun/user/${userId}`);
}

const updatePlayerStatus = async (userId, reqBody) => { 
    return await axios.put(`/server/stop_me_fun_function/player/${userId}/status`, reqBody);
} 

const fetchCurrentQuestion = async (roomId, userId) => { 
    return await axios.get(`/server/quiz_fun/room/${roomId}/user/${userId}/question/current`);
}

const getQuestions = async (roomId) => { 
    return await axios.get(`/server/quiz_fun/room/${roomId}/questions`);
}

const submitQuizAnswer = async (roomId, questionId, reqBody) => { 
    return await axios.post(`/server/quiz_fun/room/${roomId}/question/${questionId}/quiz`, reqBody);
}

const updateCurrentQuestion = async (roomId, questionId) => { 
    const updateQuery = `Update Questions set ISACTIVE=false where Questions.ROOMID=${roomId}`;
    try {
        await window.catalyst.ZCatalystQL.executeQuery(updateQuery);
        await window.catalyst.ZCatalystQL.executeQuery(`Update Questions set ISACTIVE=true where Questions.ROOMID=${roomId} and Questions.ROWID=${questionId}`);
    }catch(err) { 
        console.log({err});
    }
}

export { createPlayer, getPlayerDetails, updatePlayerStatus, getQuestions, fetchCurrentQuestion, submitQuizAnswer, updateCurrentQuestion };