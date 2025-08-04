import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("rollNumber"); // Must be set during login
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
