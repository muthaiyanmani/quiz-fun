import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchCurrentQuestion,
  getPlayerDetails,
  submitQuizAnswer
} from "../../utils/client";
import { POLLING_INTERVAL } from "../../utils/constants";
import AnswerCard from "./answer-card";
import {FadeLoader } from 'react-spinners';
import { getData } from "../../utils/localstorage";

export default function PlayPage() {
  let { roomId, userId } = useParams();
  const [quiz, setQuiz] = useState({
    data: { question: "", options: [] },
    messsage: "Fetching quiz..."
  });

  const playerData = getData("playerData");
  const [playerStats, setPlayerStats] = useState({ userName: playerData?.userName || "Fetching..." });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlayerData();
    const intervalId = setInterval(fetchQuestions, POLLING_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getPlayerData = async () => {
    try {
      const { data } = await getPlayerDetails(userId);
      const playerData = data?.data;
      setPlayerStats(playerData);
    } catch (err) {}
  };

  function transformString(inputString) {
    const words = inputString.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords[1];
  }

  const getQuizOptions = (options) =>
    Object.keys(options)
      .filter((key) => key.startsWith("option"))
      .map((key) => ({ label: options[key], value: transformString(key) })) ||
    [];

  const fetchQuestions = async () => {
    try {
      const { data, status } = await fetchCurrentQuestion(roomId, userId);
      if (status === 200) {
        const quizOptions = getQuizOptions(data?.data);
        setQuiz({
          data: { question: data?.data?.question, id: data?.data?.id, options: quizOptions },
          messsage: ""
        });
      } else {
        setQuiz({ data: { question: "",id:"", options: [] }, messsage: data?.message });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setQuiz({ data: { question: "",id:"", options: [] }, messsage: errorMessage });
    }
  };

  const submitAnswer = async (option) => { 
    setIsLoading(true);
    try {
      const { data } = await submitQuizAnswer(roomId, quiz?.data?.id, { answer: option, userId });
      setQuiz({ data: { question: "",id:"", options: [] }, messsage: data?.message });
    }catch(err) { 
      console.log({err});
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative mt-4 text-gray-50">
      <div className="flex flex-col items-center text-lg md:text-2xl">
        <h3>
          Player : <b>{playerStats?.userName}</b>
        </h3>
        <br />
        <br />

        {quiz?.messsage && <div className="flex flex-col items-center justify-center" style={{height:'calc(100vh - 300px)'}}>
          <FadeLoader color="#6366F1" />
          <h2 className="p-2 px-4 text-sm text-center md:text-lg">{quiz?.messsage}</h2>
        </div>}

        {!!quiz?.data?.options?.length && <AnswerCard quiz={quiz?.data} postAnswer={submitAnswer} />}
  
        {isLoading && <FadeLoader color="#6366F1" />}

       
      </div>
    </div>
  );
}
