import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function SubjectSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");

  // ✅ Add this function:
  const handleSubjectChange = (e) => {
    const subject = e.target.value;
    if (subject) {
      navigate(`/lesson?class=${selectedClass}&subject=${subject}`);
    }
  };

  return (
    <div className="container">
      <div className="quiz-box">
        <h2>Select Subject</h2>
        <select className="input-box" onChange={handleSubjectChange}>
          <option value="">-- Choose Subject --</option>
          <option value="english">English</option>
          <option value="math">Mathematics</option>
          <option value="science">Science</option>
          <option value="geography">Geography</option>
        </select>
      </div>
    </div>
  );
}
