import { useParams, useNavigate,Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import Table from "../../../components/table";
import Modal from "../../../components/modal";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const NETWORK_CALL_TIMEOUT = 10000;
export default function DashboardPage() {
  const { width, height } = useWindowSize();
  const { roomId } = useParams();
  const [participantsData, setParticipantsData] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const getRoomDetails = () => {
    try {
      const query = `SELECT * FROM Room WHERE ROWID=${roomId}`;
      window.catalyst.ZCatalystQL.executeQuery(query).then((resp) => {
        if (!resp.content.length) {
          toast.error("Room not found");
          navigate("/");
          return;
        }
        
        const data = resp.content[0].Room;
        const roomDetails = {
          name: data.NAME,
          createdBy: data.CREATEDBY,
          createdAt: moment(data.CREATEDTIME).format("MMMM D, YYYY"),
          level: data.LEVEL
        }
        
        getRoomParticipants(roomDetails);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getRoomParticipants = async (roomDetails) => {
    const query = `SELECT * FROM Leaderboard WHERE ROOMID=${roomId} ORDER BY score DESC`;
    try {
      const resp = await window.catalyst.ZCatalystQL.executeQuery(query);
      let participantsList = resp.content;
      
      participantsList = participantsList.map(({ Leaderboard }) => {
        return {
          userName: Leaderboard.USERNAME,
          score: Leaderboard.SCORE,
          level: Leaderboard.LEVEL,
          id: Leaderboard.ROWID,
          updatedAt: moment(Leaderboard.MODIFIEDTIME)?.format(
            "HH:mm:ss, DD MMM YYYY"
          )
        };
      });
      setParticipantsData(participantsList);

      if (roomDetails) {
        setRoomDetails(roomDetails);
      }

      const userLevel = participantsList[0];

      if (parseInt(roomDetails.level) < parseInt(userLevel?.level)) {
        setModalOpen(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const shuffleRows = () => {
    const shuffledData = participantsData.sort(() => Math.random() - 0.5);
    setParticipantsData([...shuffledData]);
  };

  useEffect(() => {
    getRoomDetails();

    const intervalId = setInterval(() => {
      getRoomParticipants();
    }, NETWORK_CALL_TIMEOUT);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const tableHeader = [
    {
      label: "User Name",
      key: "userName"
    },
    {
      label: "Score",
      key: "score"
    },
    {
      label: "Current Level",
      key: "level"
    },
    {
      label: "Last Updated",
      key: "updatedAt"
    }
  ];
  return (
    <>
      <Table header={tableHeader} data={participantsData} />
      {modalOpen && (
        <>
          <Confetti width={width} height={height} />

          <Modal open={modalOpen} setOpen={setModalOpen}>
            <Confetti width={width} height={height} />
            <h1 className="text-lg">Top 3 Players</h1>
            <br />
            <div className="flex flex-col">
              {participantsData.slice(0, 3).map((item, index) => (
                <div
                  className="flex flex-row items-center justify-between py-2"
                  key={index}
                >
                  <div className="flex flex-col">
                    <div className="flex gap-2">
                      <span className="font-semibold text-md">
                        # {index + 1}
                      </span>
                      <span className="font-semibold text-md">
                        {item.userName}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-md">{item.score}</span>
                </div>
              ))}
              <br />

              <div className="flex justify-end">
                <Link
                  to="/"
                  className="w-40 px-3 py-2 text-sm font-semibold text-center text-gray-900 bg-white rounded-md shadow-sm decoration- ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
                >
                  End Game
                </Link>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
