import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/home";
import RoomsPage from "./pages/admin/rooms";
import { ProtectedRoute } from "./utils/protected-route";
import SignInPage from "./pages/admin/signin";
import { UserProvider, useUser } from "./context/user";
import PlayPage from "./pages/play";
import DashboardPage from "./pages/admin/dashboard";
import { useLocation } from "react-router-dom";
import StartScreen from "./pages/admin/dashboard/start-screen";
import QuestionCard from "./components/question";
import { QuestionProvider } from "./context/questions";
import { LeaderboardProvider } from "./context/leaderboard";
import logo from "/public/assets/logo.png";

export default function App() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/" || pathname.includes('/dashboard') || pathname.includes('/quiz/');
  return (
    <main className="w-full">
      {!isHomePage && (
        <Link to="/" className="flex items-center justify-center gap-2 mb-2">
          <span className="block text-2xl font-bold text-transparent md:text-3xl bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 decoration-8">
            QuizMe.Fun
          </span>
        </Link>
      )}
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/play/:roomId/:userId" element={<PlayPage />} />

        <Route
          path="/admin/rooms"
          element={
            <UserProvider>
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            </UserProvider>
          }
        />

        <Route
          path="/admin/room/:roomId/dashboard"
          element={
            <UserProvider>
              <ProtectedRoute>
                <QuestionProvider>
                  <LeaderboardProvider>
                    <DashboardPage>
                      <StartScreen />
                    </DashboardPage>
                  </LeaderboardProvider>
                </QuestionProvider>
              </ProtectedRoute>
            </UserProvider>
          }
        />
        <Route
          path="/admin/room/:roomId/quiz/:questionId/view"
          element={
            <UserProvider>
              <ProtectedRoute>
                <QuestionProvider>
                  <LeaderboardProvider>
                    <DashboardPage>
                      <QuestionCard />
                    </DashboardPage>
                  </LeaderboardProvider>
                </QuestionProvider>
              </ProtectedRoute>
            </UserProvider>
          }
        />

        <Route path="/admin/signin" element={<SignInPage />} />
      </Routes>
    </main>
  );
}
