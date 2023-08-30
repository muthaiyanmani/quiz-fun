import axios from "axios";

const createPlayer = async (reqBody) => { 
   return await axios.post("/server/stop_me_fun_function/player/create", reqBody);
}

const getPlayerDetails = async (userId) => { 
    return await axios.get(`/server/stop_me_fun_function/player/${userId}`);
}

const updatePlayerStatus = async (userId, reqBody) => { 
    return await axios.put(`/server/stop_me_fun_function/player/${userId}/status`, reqBody);
}

export { createPlayer, getPlayerDetails, updatePlayerStatus };