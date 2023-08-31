import { createContext, useReducer } from "react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getLeaderboardStats } from "../utils/client";


const LeaderboardContext = createContext(null);

const reducer = (state, action) => { 
    switch (action.type) {
        case 'GET_LEADERBOARD':
            return action.payload;
        default:
            return state;
    }
}

const LeaderboardProvider = ({ children }) => { 
    const [state, dispatch] = useReducer(reducer, null);
    const { roomId, questionId } = useParams();
    
    const fetchLeaderboard = async () => {
        const leaderboard = await getLeaderboardStats(roomId, questionId);
        dispatch({ type: 'GET_LEADERBOARD', payload: leaderboard });
    }
    
    useEffect(() => { 
        fetchLeaderboard();
    }, [])

    const getLeaderboard = () => state || [];

    const value = { getLeaderboard,fetchLeaderboard };
    return <LeaderboardContext.Provider value={value}>{children}</LeaderboardContext.Provider>
}

const useLeaderboard = () => { 
    const context = useContext(LeaderboardContext);
    if (context === undefined) { 
        throw new Error('useLeaderboard must be used within a LeaderboardProvider');
    }
    return context;
}
export { LeaderboardProvider, useLeaderboard };

