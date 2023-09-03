import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLeaderboard } from "../../../context/leaderboard";
import logo from "/public/assets/logo.png";

export default function DashboardPage({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getLeaderboard, fetchLeaderboard } = useLeaderboard();
  const players = getLeaderboard() || [];

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex flex-col px-6 overflow-y-auto bg-gray-900 grow gap-y-5 ring-1 ring-white/10">
                    <div className="flex items-center h-16 shrink-0">
                      <img
                        className="w-auto h-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="">
          <main className="lg:pr-96">
            <header className="flex items-center justify-between px-4 py-4 border-b border-white/5 sm:px-6 sm:py-6 lg:px-8">
              <Link to="/" className="flex items-center justify-center gap-2 ">
                <span className="block text-2xl font-bold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 decoration-8">
                  QuizMe.Fun
                </span>
              </Link>
            </header>
            <div className="px-4 rounded-xl">{children}</div>
          </main>

          {/* Activity feed */}
          <aside className="mt-3 activity-feed bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
            <header className="flex items-center justify-between px-4 py-4 border-b border-white/5 sm:px-6 sm:py-6 lg:px-8">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Activity feed
              </h2>
            </header>

            <ul role="list" className="divide-y divide-white/5">
              <AnimatePresence>
                {players?.length ? (
                  players.map((item, index) => (
                    <motion.li
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={item.id}
                      className="px-4 py-4 sm:px-6 lg:px-8"
                    >
                      <div className="flex items-center gap-x-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                          {item?.name.toUpperCase().charAt(0)}
                        </span>
                        <h3 className="flex-auto text-sm font-semibold leading-6 text-white truncate">
                          {item?.name}
                        </h3>
                        <span className="text-white">{item.score}</span>
                      </div>
                    </motion.li>
                  ))
                ) : (
                  <p className="p-4 px-6 text-sm text-white">
                    Quiz not started yet.
                  </p>
                )}
              </AnimatePresence>
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
