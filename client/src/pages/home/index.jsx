import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setData as setDataInLocalStorage,
  getData as getDataFromLocalStorage
} from "../../utils/localstorage";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { createPlayer } from "../../utils/client";
import gradientBlob from "../../../public/assets/gradient blob.webp";
import gradientBlob1 from "../../../public/assets/geadient blob1.webp";


export default function HomePage() {
  const [data, setData] = useState({
    roomName: "",
    userName: ""
  });
  const [previousData] = useState(getDataFromLocalStorage("playerDetails"));
  const navigate = useNavigate();

  const joinRoom = async (e) => {
    e.preventDefault();
    const { roomName, userName } = data;
    const toaster = toast.loading("Adding user in the room...");

    try {
      const { data } = await createPlayer({ roomName, userName });
      const playerData = data?.data;
      toast.update(toaster, {
        render: "User registered successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      setDataInLocalStorage("playerDetails", playerData);
      navigate(`/play/${playerData?.roomId}/${playerData?.userId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.update(toaster, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    }
  };

  return (
    <>
      <img className="stacked-blob-1" src={gradientBlob} alt="" />
      <img className="stacked-blob-2" src={gradientBlob1} alt="" />
      <div className="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8 login-box">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <h1
            className="text-lg font-bold leading-9 tracking-tight text-center text-white md:text-3xl"
            to={"/"}
          >
            Quizme.fun
          </h1> */}
          <h2 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-white">
            Join a room to play quiz.
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={joinRoom}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-white"
              >
                Your Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={data.userName}
                  onChange={(e) => setData({ ...data, userName: e.target.value })}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="roomName"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Room Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="roomName"
                  name="roomName"
                  type="text"
                  value={data.roomName}
                  onChange={(e) => setData({ ...data, roomName: e.target.value })}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Join Room
              </button>
            </div>
          </form>

          <p className="mt-10 text-sm text-center text-gray-300">
            Are you an admin?{" "}
            <Link
              to="/admin/rooms"
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
            >
              Manage your room here
            </Link>
            <br /> <br />
            {previousData && (
              <Link
                className="flex items-center justify-center gap-1"
                to={`/play/${previousData.roomId}/${previousData.userId}`}
              >
                Your recently accessed room : <span className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">{previousData.roomName}</span> {" "}
                <ArrowTopRightOnSquareIcon className="inline w-4 h-4 font-bold " />{" "}
              </Link>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
