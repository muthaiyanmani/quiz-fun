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

export default function App() {
  const { getUserDetails } = useUser();
  let isUserLoggedIn = getUserDetails() ? true : false;
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  // TODO: remove this after dev
  isUserLoggedIn = true;
  return (
    <>
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
                <DashboardPage>
                  <StartScreen />
                </DashboardPage>
              </QuestionProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/room/:roomId/dashboard/quiz/:questionId"
          element={
            <ProtectedRoute isLoggedIn={isUserLoggedIn}>
              <QuestionProvider>
                <DashboardPage>
                  <QuestionCard />
                </DashboardPage>
              </QuestionProvider>
            </ProtectedRoute>
          }
        />

        <Route path="/admin/signin" element={<SignInPage />} />
      </Routes>
    </>
  );
}
