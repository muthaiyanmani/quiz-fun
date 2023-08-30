import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const statsOptions = [
  { name: "Room Name", key:"roomName", value: "Fetc" },
  { name: "Number of Players",key:"players", value: "65" },
  { name: "Number of Questions",key:"questions", value: "3" }
];

export default function StartScreen() {

    const [stats, setStats] = useState(statsOptions);
    const { roomId } = useParams();

    const getRoomStats = async () => {
        const query = `SELECT Rooms.NAME AS room_name,(SELECT COUNT(*) FROM Participants WHERE ROOMID=${roomId}) AS participant_count,(SELECT COUNT(*) FROM Questions WHERE ROOMID =${roomId}) AS question_count FROM Rooms WHERE Rooms.ROOMID =${roomId};`;
        const resp = await window.catalyst.ZCatalystQL.executeQuery(query);
        // const count = resp.content[0].Players.COUNT;
        //setStats((prev) => ({ ...prev, players: count }));
    }

    useEffect(() => {
        getRoomStats();
    }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 mx-4 border-2 border-gray-600 rounded-lg">
      <div className="m-8 bg-gray-900 ">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="px-4 py-6 bg-gray-900 sm:px-6 lg:px-8"
              >
                <p className="text-sm font-medium leading-6 text-gray-400">
                  {stat.name}
                </p>
                <p className="flex items-baseline mt-2 gap-x-2">
                  <span className="text-3xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </span>
                  {stat.unit ? (
                    <span className="text-sm text-gray-400">{stat.unit}</span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-white">
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Start Quiz
        </button>
      </div>
    </div>
  );
}
