import React, { useState, useEffect } from "react";
import { updatePlayerStatus } from "../../utils/client";
import moment from "moment";
import { toast } from "react-toastify";
import "./timer.css";

export default function Timer({ playerDetails, setPlayerDetails }) {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const handleResetCounter = () => {
    setIsActive(false);
    setTime(0);
    setDisabled(false);
  };

  const handleTimer = async () => {
    setIsActive(!isActive);

    if (isActive) {
      try {
        setDisabled(true);
        const { data, status } = await updatePlayerStatus(
          playerDetails?.userId,
          {
            clickedTimer: parseFloat(time),
            level: parseInt(playerDetails?.level)
            // secretKey: "stop_me_fun"
          }
        );
        if (status === 200) {
          toast.success("Your new highest score has been updated.", {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: false,
            closeOnClick: true
          });
          return setPlayerDetails(data?.data);
        }

        toast.warning(data?.data?.message, {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: false,
          closeOnClick: true
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <button
          disabled={disabled}
          title={disabled ? "Button is disabled" : ""}
          className={`block w-40 h-40 text-3xl text-white rounded-full cursor-pointer lg:w-64 lg:h-64 font-timer shadow-2xl transform-gpu transition-transform duration-300 hover:-translate-y-1 ring-4 ring-gray-700 active:ring-2 active:ring-indigo-800 ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-indigo-600"
              : "bg-gradient-to-br from-indigo-700 to-indigo-900 hover:bg-indigo-800"
          }`}
          onClick={handleTimer}
        >
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-timer">
            {time}
          </h1>
        </button>

        <br />
        <br />
        <button
          disabled={!disabled}
          title={!disabled ? "Button is disabled" : ""}
          className={`block w-20 h-20 text-white rounded-full text-md md:text-xl lg:text-2xl lg:w-28 lg:h-28 font-timer shadow-2xl transform-gpu transition-transform duration-300 hover:-translate-y-1 ring-4 ring-gray-700 active:ring-2 active:ring-indigo-800 ${
            !disabled
              ? "opacity-50 cursor-not-allowed bg-indigo-600"
              : "bg-gradient-to-br from-indigo-700 to-indigo-900 hover:bg-indigo-800"
          }`}
          onClick={handleResetCounter}
        >
          Reset
        </button>
      </div>

      <br />
      <br />

      <h3 className="text-sm md:text-lg">
        Last score updated at{" "}
        {moment(playerDetails?.updatedAt).format("HH:mm:ss")}
      </h3>

      {/* <div class="wrapper">
        <input type="checkbox" onChange={handleTimer}/>
        <label>
         
          <i class="icon-off"></i>
          <p className="absolute text-5xl text-white top-20 left-10"> {time}</p>
        </label>
       
      </div> */}
    </div>
  );
}
