// src/components/AdminRoute.js
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
