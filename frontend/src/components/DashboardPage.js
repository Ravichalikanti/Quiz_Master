import { useNavigate } from "react-router-dom";
import "../App.css"; //👈 Add this if CSS is in a separate file

export default function DashboardPage() {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("studentName") || "Student";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* 🎓 Welcome message */}
      <div className="dashboard-welcome">
        🎓 Welcome, <span className="dashboard-name">{studentName}</span>!
      </div>

      {/* Main content box */}
      <div className="quiz-box">
        <div className="dashboard-buttons">
          <button className="page-button" onClick={() => navigate("/class")}>
            🚀 Start Quiz
          </button>
          <button className="page-button" onClick={() => navigate("/leaderboard")}>
            🏆 View Leaderboard
          </button>
          <button className="page-button" onClick={() => navigate("/certificates")}>
            📄 My Certificates
          </button>
          <button className="page-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
