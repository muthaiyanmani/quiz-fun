import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlayerDetails } from "../../utils/client";
import { toast } from "react-toastify";
import Timer from "./timer";

export default function PlayPage() {
  let { roomId, userId } = useParams();
  const [playerStats, setPlayerStats] = useState({
    userName: "Fetching..",
    score: "Fetching..",
    level: "Fetching.."
  });

  useEffect(() => {
    getPlayerData();
  }, []);

  const getPlayerData = async () => {
    try {
      const { data } = await getPlayerDetails(userId);
      const playerData = data?.data;
      setPlayerStats(playerData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    }
  };

  const updatePlayerStats = (stats) => {
    setPlayerStats(stats);
  };

  return (
    <div className="mt-4 text-gray-50">
      <div className="flex flex-col items-center text-lg md:text-2xl">
        <h3>
          Player: <b>{playerStats?.userName}</b>
        </h3>
        <h3>
          Score: <b>{playerStats?.score}</b>
        </h3>
        <h3>
          Level:<b> {playerStats?.level}</b>
        </h3>
        <h3>
          Target Timer:{" "}
          <b>{parseInt(playerStats?.level) * 100}</b>
        </h3>
        <br />
        <br />
        <Timer
          setPlayerDetails={updatePlayerStats}
          playerDetails={playerStats}
        />
      </div>
    </div>
  );
}
