import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const isAdminAuth = localStorage.getItem("adminAuth") === "true";
  return isAdminAuth ? children : <Navigate to="/admin-login" replace />;
}