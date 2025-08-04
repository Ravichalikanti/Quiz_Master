import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ClassSelection from "./components/ClassSelection";
import SubjectSelection from "./components/SubjectSelection";
import LessonSelection from "./components/LessonSelection";
import Leaderboard from "./components/Leaderboard";
import Quiz from "./components/Quiz";
import SignUp from "./components/SignUp"; 
import CertificatePage from "./components/CertificatePage";
import DashboardPage from "./components/DashboardPage";
import MyCertificatesPage from "./components/MyCertificatesPage";
import AdminPanel from "./components/Admin/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute"; // ✅ import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Student Routes */}
        <Route
          path="/class"
          element={
            <PrivateRoute>
              <ClassSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/subject"
          element={
            <PrivateRoute>
              <SubjectSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/lesson"
          element={
            <PrivateRoute>
              <LessonSelection />
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <PrivateRoute>
              <Leaderboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificate"
          element={
            <PrivateRoute>
              <CertificatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <PrivateRoute>
              <MyCertificatesPage />
            </PrivateRoute>
          }
        />

        {/* Admin route is public for now (you can protect it separately if needed) */}
        <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
