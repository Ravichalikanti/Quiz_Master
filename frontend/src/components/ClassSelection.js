import { useNavigate } from "react-router-dom";
import "../App.css";

export default function ClassPage() {
  const navigate = useNavigate();

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    if (selectedClass) {
      navigate(`/subject?class=${selectedClass}`);
    }
  };

  return (
    <div className="container">
      <div className="quiz-box">
        <h2>Select Your Class</h2>
        <select className="input-box" onChange={handleClassChange}>
          <option value="">-- Choose Class --</option>
          <option value="1">Class 1</option>
          <option value="2">Class 2</option>
          <option value="3">Class 3</option>
          <option value="4">Class 4</option>
          <option value="5">Class 5</option>
          <option value="6">class 6</option>
        </select>
      </div>
    </div>
  );
}
