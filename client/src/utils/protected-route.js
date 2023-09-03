import { useUser } from "../context/user";

export const ProtectedRoute = ({ children }) => {
    const { getUserDetails } = useUser();
    if (getUserDetails()) {
        return children;
    }
}