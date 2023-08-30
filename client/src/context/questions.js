import { createContext, useReducer } from "react";
import { useContext, useEffect } from "react";
import { getQuestions } from "../utils/client";
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
    const { roomId} = useParams();
    
    useEffect(() => { 
        const fetchQuestions = async () => {
            const { data } = await getQuestions(roomId);
            dispatch({ type: 'GET_QUESTIONS', payload: data?.data || [] });
        }
        fetchQuestions();
    }, [])

    const getAllQuestions = () => state;
    const getQuestionById = (questionId) => state.find(question => question.id === questionId);

    const value = { getAllQuestions, getQuestionById };
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

