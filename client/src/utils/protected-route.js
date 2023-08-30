import { Navigate, Route } from "react-router-dom"

export const ProtectedRoute = ({ children, isLoggedIn }) => {
    if (isLoggedIn) {
        return children;
    }
    return <Navigate to="/admin/signin" replace />
}