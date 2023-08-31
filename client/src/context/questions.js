import { createContext, useReducer, useState } from "react";
import { useContext, useEffect } from "react";
import { getQuestions, getRoomData } from "../utils/client";
import { useParams } from "react-router-dom";


const QuestionContext = createContext(null);

const reducer = (state, action) => { 
    switch (action.type) {
        case 'GET_QUESTIONS':
            return action.payload;
        default:
            return state;
    }
}

const QuestionProvider = ({ children }) => { 
    const [state, dispatch] = useReducer(reducer, null);
    const [roomDetails, setRoomDetails] = useState({});
    const { roomId, questionId} = useParams();
    
    useEffect(() => { 
        const fetchQuestions = async () => {
            const { data } = await getQuestions(roomId);
            let questions = data?.data || [];
            questions = questions.map((quest, index) => ({ ...quest, index: index + 1}));
            dispatch({ type: 'GET_QUESTIONS', payload: questions });

            const roomDetails = await getRoomData(roomId);
            setRoomDetails(roomDetails || {});
        }
        fetchQuestions();
    }, [])

    const getAllQuestions = () => state || [];
    const getQuestionById = (questionId) => state?.find(question => question.id === questionId) || {};
    const getCurrentQuestion = () => state?.find(question => question.id === questionId) || {};
    const getRoomDetails = () => roomDetails || {};

    const value = { getAllQuestions, getQuestionById, getCurrentQuestion, getRoomDetails };
    return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>
}

const useQuestions = () => { 
    const context = useContext(QuestionContext);
    if (context === undefined) { 
        throw new Error('useQuestion must be used within a QuestionProvider');
    }
    return context;
}
export { QuestionProvider, useQuestions };

