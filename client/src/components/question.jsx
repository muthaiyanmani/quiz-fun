import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ChartBarIcon,
  ChartPieIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useQuestions } from "../context/questions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizOptions from "./options";
import { updateCurrentQuestion, updateRoomStatus } from "../utils/client";
import { useLeaderboard } from "../context/leaderboard";
import Modal from "./modal";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function QuestionCard({ updateLeaderboard }) {
  const { getCurrentQuestion, getAllQuestions } = useQuestions();
  const navigate = useNavigate();
  const { roomId, questionId } = useParams();
  const { getLeaderboard, fetchLeaderboard } = useLeaderboard();
  const [openModal, setOpenModal] = useState(false);
  const [summaryModal, setSummaryModal] = useState(false);
  const [questionSummary, setQuestionSummary] = useState([]);
  const { width, height } = useWindowSize();
  const players = getLeaderboard() || [];

  const quiz = getCurrentQuestion();
  const questions = getAllQuestions() || [];
  const hasPrevious = quiz?.index > 1;
  const hasNext = quiz?.index < questions.length;

  useEffect(() => {
    updateCurrentQuestion(roomId, questionId);
    return () => {
      fetchLeaderboard();
    };
  }, [questionId]);

  function transformString(inputString) {
    const words = inputString.replace(/([a-z])([A-Z])/g, "$1 $2").split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );
    return capitalizedWords.join(" ");
  }

  const getQuizOptions = () =>
    Object.keys(quiz)
      .filter((key) => key.startsWith("option"))
      .map((key) => ({ key: quiz[key], label: transformString(key) })) || [];

  const moveToPreviousQuestion = () => {
    if (hasPrevious) {
      const previousQuestion = questions[quiz.index - 2];
      navigate(`/admin/room/${roomId}/quiz/${previousQuestion.id}/view`);
    } else {
      navigate(`/admin/room/${roomId}/dashboard`);
    }
  };

  const moveToNextQuestion = () => {
    if (hasNext) {
      const nextQuestion = questions[quiz.index];
      navigate(`/admin/room/${roomId}/quiz/${nextQuestion.id}/view`);
    } else {
      setOpenModal(true);
    }
  };

  const completeQuiz = async () => {
    await fetchLeaderboard();
    await updateRoomStatus(roomId);
    navigate(`/`);
  };

  const getQuestionSummary = async () => {
    setSummaryModal(true);
    try {
      const resp = await window.catalyst.ZCatalystQL.executeQuery(
        `Select NOOFPEOPLE,ANSWER from Answers where QUESTIONID=${questionId}`
      );
      let data = resp?.content || [];
      data = data.map((item) => item?.Answers);
      
      const currentQuestion = getCurrentQuestion();
      const totalResponses = data.reduce((acc, item) => acc + parseInt(item?.NOOFPEOPLE), 0);
      let optionsSummary =
        data.map((item) => ({
          option: item?.ANSWER,
          count: parseInt(item?.NOOFPEOPLE),
          percentage: ((parseInt(item?.NOOFPEOPLE) / totalResponses) * 100).toFixed(2) + "%"
        })) || [];
      optionsSummary = optionsSummary.sort((a, b) => b.count - a.count);
      setQuestionSummary(optionsSummary);

    //   if (optionsSummary.length) {
    //     const opt = optionsSummary[0];
    //     const result = Object.keys(currentQuestion).map((key) => {
    //       if (opt.option === currentQuestion[key]) {
    //         return { label: key, value: parseInt(opt.count) };
    //       }
    //     })
    //     console.log(result);
      //  }
  
    } catch (e) {
      console.log(e);
    }
  };

  const closeSummary = () => { 
    setSummaryModal(false);
    setQuestionSummary([]);
  }

  return (
    <form className="p-4 text-white">
      <div className="space-y-12">
        <div className="pb-12 border-b border-white/10">
          <h2 className="font-semibold leading-7 text-md md:text-lg">
            Question {quiz?.index}/{questions.length}
          </h2>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-xl font-semibold leading-6 text-white md:text-2xl lg:text-4xl">
                {quiz?.question}
              </legend>
              <br />
              <br />
              <br />
              <QuizOptions options={getQuizOptions()} />
            </fieldset>
          </div>
        </div>
      </div>

      {summaryModal && (
        <Modal open={summaryModal} setOpen={setSummaryModal}>
          <h1 className="text-lg">Question Summary</h1>
         <br/>
          <ul>
            {questionSummary.map((item, index) => (
              
                <li className="flex flex-row items-center justify-between py-2 text-md" key={index}>
                {item?.option} : <b>{item?.percentage}</b> 
              </li>
            ))}
          </ul>
          <br/>
          <button
            type="button"
            onClick={closeSummary}
              className="float-right px-4 py-2 text-sm text-center text-gray-900 bg-white rounded-md shadow-sm flex-end decoration- ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
            >
              Close
            </button>
        </Modal>
      )}

      {openModal && <Confetti width={width} height={height} />}

      <div className="flex items-center justify-around mt-6 gap-x-6">
        <div className="text-white">
          <button
            type="button"
            onClick={() => moveToPreviousQuestion()}
            disabled={!hasPrevious}
            className="inline-flex w-32 md:w-40 items-center justify-center gap-x-2 rounded-md bg-indigo-600 p-2 md:px-4 md:py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            <ArrowLeftCircleIcon
              className="w-4 h-4 md:w-8 md:h-8"
              aria-hidden="true"
            />
            Previous
          </button>
        </div>

        <div className="text-white">
          <button
            type="button"
            onClick={getQuestionSummary}
            className="inline-flex w-32 md:w-40 items-center justify-center gap-x-2 rounded-md bg-indigo-600 p-2 md:px-4 md:py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            <ChartPieIcon
              className="w-4 h-4 md:w-8 md:h-8"
              aria-hidden="true"
            />
            Summary
          </button>
        </div>

        <div className="text-white">
          <button
            type="button"
            onClick={() => moveToNextQuestion()}
            className="inline-flex w-32 md:w-40  items-center justify-center gap-x-2 rounded-md bg-indigo-600 p-2 md:px-4 md:py-2.5 text-md text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            {hasNext ? (
              <>
                {" "}
                <ArrowRightCircleIcon
                  className="w-4 h-4 md:w-8 md:h-8"
                  aria-hidden="true"
                />{" "}
                Next{" "}
              </>
            ) : (
              <>
                {" "}
                <CheckCircleIcon
                  className="w-4 h-4 md:w-8 md:h-8"
                  aria-hidden="true"
                />{" "}
                Finish{" "}
              </>
            )}
          </button>
        </div>
      </div>

      <Modal open={openModal} setOpen={setOpenModal}>
        <Confetti width={width} height={height} />
        <h1 className="text-lg">Top 3 Players</h1>
        <br />
        <div className="flex flex-col">
          {players.slice(0, 3).map((item, index) => (
            <div
              className="flex flex-row items-center justify-between py-2"
              key={index}
            >
              <div className="flex flex-col">
                <div className="flex gap-2">
                  <span className="font-semibold text-md"># {index + 1}</span>
                  <span className="font-semibold text-md">{item.name}</span>
                </div>
              </div>
              <span className="font-semibold text-md">{item.score}</span>
            </div>
          ))}
          <br />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={completeQuiz}
              className="w-40 px-3 py-2 text-sm font-semibold text-center text-gray-900 bg-white rounded-md shadow-sm decoration- ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
            >
              End Quiz
            </button>
          </div>
        </div>
      </Modal>
    </form>
  );
}
