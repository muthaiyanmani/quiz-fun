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

const fetchCurrentQuestionOptions = async (roomId) => { 
    return await axios.get(`/server/quiz_fun/room/${roomId}/question/current`);
}

const getQuestions = async (roomId) => { 
    return await axios.get(`/server/quiz_fun/room/${roomId}/questions`);
}

export { createPlayer, getPlayerDetails, updatePlayerStatus, getQuestions, fetchCurrentQuestionOptions };