import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/home";
import RoomsPage from "./pages/admin/rooms";
import { ProtectedRoute } from "./utils/protected-route";
import SignInPage from "./pages/admin/signin";
import { useUser } from "./context/user";
import PlayPage from "./pages/play";
import DashboardPage from "./pages/admin/dashboard";
import { useLocation } from "react-router-dom";
import StartScreen from "./pages/admin/dashboard/start-screen";
import QuestionCard from "./components/question";
import { QuestionProvider } from "./context/questions";
import { LeaderboardProvider } from "./context/leaderboard";

export default function App() {
  const { getUserDetails } = useUser();
  let isUserLoggedIn = getUserDetails() ? true : false;
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  // TODO: remove this after dev
  isUserLoggedIn = true;
  return (
    <>
      
      <h1 className="my-4 text-2xl font-bold text-center text-transparent text-white from-10% via-30% bg-clip-text bg-gradient-to-r from-indigo-400 to-100% to-indigo-900 md:text-4xl">Quiz.Fun</h1>
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/play/:roomId/:userId" element={<PlayPage />} />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <RoomsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/room/:roomId/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <QuestionProvider>
                <LeaderboardProvider>
                  <DashboardPage>
                    <StartScreen />
                  </DashboardPage>
                </LeaderboardProvider>
              </QuestionProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/room/:roomId/quiz/:questionId/view"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <QuestionProvider>
                <LeaderboardProvider>
                  <DashboardPage>
                    <QuestionCard />
                  </DashboardPage>
                </LeaderboardProvider>
              </QuestionProvider>
            </ProtectedRoute>
          }
        />

        <Route path="/admin/signin" element={<SignInPage />} />
      </Routes>
    </>
  );
}
