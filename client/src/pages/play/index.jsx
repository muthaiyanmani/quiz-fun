import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchCurrentQuestionOptions,
  getPlayerDetails
} from "../../utils/client";
import { POLLING_INTERVAL } from "../../utils/constants";
import AnswerCard from "./answer-card";

export default function PlayPage() {
  let { roomId, userId } = useParams();
  const [quiz, setQuiz] = useState({
    data: { question: "", options: [] },
    messsage: "Fetching quiz..."
  });
  const [playerStats, setPlayerStats] = useState({ userName: "Fetching..." });

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
      const { data } = await fetchCurrentQuestionOptions(roomId);
      const quizOptions = getQuizOptions(data?.data);
      setQuiz({
        data: { question: data?.data?.question, options: quizOptions },
        messsage: ""
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setQuiz({ data: { question: "", options: [] }, messsage: errorMessage });
    }
  };

  return (
    <div className="mt-4 text-gray-50">
      <div className="flex flex-col items-center text-lg md:text-2xl">
        <h3>
          Player: <b>{playerStats?.userName}</b>
        </h3>
        <br />
        <br />

        {!!quiz?.data?.options?.length && <AnswerCard quiz={quiz?.data} />}

        <h2>{quiz?.messsage}</h2>
      </div>
    </div>
  );
}
