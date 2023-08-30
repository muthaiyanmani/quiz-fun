import { Route, Routes, Link } from "react-router-dom";
import HomePage from "./pages/home";
import RoomsPage from "./pages/admin/rooms";
import { ProtectedRoute } from "./utils/protected-route";
import SignInPage from "./pages/admin/signin";
import { useUser } from "./context/user";
import PlayPage from "./pages/play";
import DashboardPage from "./pages/admin/dashboard";
import { useLocation } from "react-router-dom";

export default function App() {
  const { getUserDetails } = useUser();
  let isUserLoggedIn = getUserDetails() ? true : false;
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  // TODO: remove this after dev
  isUserLoggedIn = true;
  return (
    <>
      {
        !isHomePage &&  <Link to="/" className="flex items-center justify-center ">
        <span className="block mt-4 text-3xl font-bold text-transparent md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500 decoration-8">StopMe.Fun</span>
        <img
          className="w-16 h-16 md:w-28 md:h-28 lg:w-32 lg:h-32"
          src="assets/logo-animated.gif"
          alt="Stopwatch"
        />
      </Link>
     }
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
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/signin" element={<SignInPage />} />
      </Routes>
    </>
  );
}
