import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setData as setDataInLocalStorage,
  getData as getDataFromLocalStorage
} from "../../utils/localstorage";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { createPlayer } from "../../utils/client";

export default function HomePage() {
  const [data, setData] = useState({
    roomName: "",
    userName: ""
  });
  const [previousData] = useState(getDataFromLocalStorage("playerData"));
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
  
      setDataInLocalStorage("playerData", playerData);
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
    <main className="flex flex-col min-h-screen text-gray-700">
      <div style={{ height: 'calc(100vh - 250px)' }} className="flex flex-col items-center flex-grow px-4 lg:flex-row md:px-8 lg:px-10">
        <div className="max-w-4xl">
          <h1 className="flex items-center justify-center">
          <span className="block mt-4 text-3xl font-bold text-transparent md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 decoration-8">StopMe.Fun</span>
            <img
              className="w-16 h-16 md:w-28 lg:w-32 lg:h-32"
              src="assets/logo-animated.gif"
              alt="Stopwatch"
            />
          </h1>
          <h2 className="py-8 mx-auto text-3xl font-bold tracking-normal text-center text-gray-50 md:text-left lg:text-5xl font-display sm:text-5xl">
            Dive into the realm where every tick is an epic adventures! with
            <span className="relative text-indigo-600 whitespace-nowrap">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-indigo-500/60"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative"> timer</span>.
            </span>
          </h2>
          <div className="relative text-sm md:text-md">
            {previousData && (
              <>
                <img className="h-96 w-96" src="assets/board.png" alt="Board" />
                <div className="absolute left-16 top-20">
                  <p>You have recently accessed this game.</p>
                  <p>Room Name: {previousData.roomName}</p>
                  <p className="mb-4">User Name: {previousData.userName}</p>

                  <Link
                    className="px-3 py-2 text-sm text-white bg-indigo-600 rounded-xl"
                    to={`/play/${previousData.roomId}/${previousData.userId}`}
                  >
                    Go to game{" "}
                    <ArrowTopRightOnSquareIcon className="inline w-4 h-4 font-bold" />{" "}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-gray-50">
          <div className="flex flex-col justify-center flex-1 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="text-2xl leading-9 tracking-tight text-center lg:text-4xl ">
                Join into your room and start playing.
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={joinRoom} className="space-y-6 text-md">
                <div>
                  <label
                    htmlFor="roomName"
                    className="block font-medium leading-6 text-md"
                  >
                    Room Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="roomName"
                      name="roomName"
                      type="text"
                      value={data.roomName}
                      onChange={(e) =>
                        setData({ ...data, roomName: e.target.value })
                      }
                      required
                      className="block w-full py-2 text-gray-900 border-0 rounded-md shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="userName"
                    className="block font-medium leading-6 text-md"
                  >
                    Your Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      value={data.userName}
                      onChange={(e) =>
                        setData({ ...data, userName: e.target.value })
                      }
                      required
                      className="block w-full py-2 text-gray-900 border-0 rounded-md shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <br />

                <div>
                  <button
                    type="submit"
                    className="flex justify-center w-full px-3 py-2 text-sm font-semibold leading-6 text-white bg-indigo-600 rounded-md shadow-sm text-md md:text-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Join Now
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-gray-500 text-md md:text-lg">
                Are you admin?{" "}
                <a
                  href="#/admin/rooms"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Create a new room here.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="hidden lg:block">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
          <path
            fill="#5000ca"
            fill-opacity="1"
            d="M0,64L17.1,64C34.3,64,69,64,103,74.7C137.1,85,171,107,206,122.7C240,139,274,149,309,133.3C342.9,117,377,75,411,90.7C445.7,107,480,181,514,192C548.6,203,583,149,617,122.7C651.4,96,686,96,720,117.3C754.3,139,789,181,823,186.7C857.1,192,891,160,926,170.7C960,181,994,235,1029,245.3C1062.9,256,1097,224,1131,218.7C1165.7,213,1200,235,1234,234.7C1268.6,235,1303,213,1337,192C1371.4,171,1406,149,1423,138.7L1440,128L1440,320L1422.9,320C1405.7,320,1371,320,1337,320C1302.9,320,1269,320,1234,320C1200,320,1166,320,1131,320C1097.1,320,1063,320,1029,320C994.3,320,960,320,926,320C891.4,320,857,320,823,320C788.6,320,754,320,720,320C685.7,320,651,320,617,320C582.9,320,549,320,514,320C480,320,446,320,411,320C377.1,320,343,320,309,320C274.3,320,240,320,206,320C171.4,320,137,320,103,320C68.6,320,34,320,17,320L0,320Z"
          ></path>
        </svg>
      </footer>
    </main>
  );
}
