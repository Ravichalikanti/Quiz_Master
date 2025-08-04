import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");

  const rollNumber = localStorage.getItem("rollNumber");

  const chapterMap = {
    "1": { english: ["Alphabet", "Basic Words", "Colors"], math: ["Counting", "Shapes", "Numbers up to 100"], science: ["Parts of the Body", "Living and Non-Living", "Our Surroundings"], geography: ["Our Earth", "Weather", "Directions"] },
    "2": { english: ["Sentences", "Nouns", "Verbs"], math: ["Numbers up to 1000", "Addition and Subtraction", "Multiplication Basics"], science: ["Plants", "Animals", "Weather"], geography: ["Our Country", "Seasons", "Maps"] },
    "3": { english: ["Adjectives", "Pronouns", "Tenses"], math: ["Fractions", "Time", "Multiplication and Division"], science: ["Human Body", "Water", "Light"], geography: ["India", "Continents", "Oceans"] },
    "4": { english: ["Nouns", "Verbs", "Adjectives"], math: ["Decimals", "Perimeter and Area", "Angles"], science: ["Plants", "Animals", "Human Body"], geography: ["Continents and Oceans", "Mountains and Valleys", "Rivers and Lakes"] },
    "5": { english: ["Tenses", "Prepositions", "Conjunctions"], math: ["Fractions", "Decimals", "Geometry"], science: ["Human Body", "Plants", "Earth and Space"], geography: ["Continents", "Oceans", "Landforms"] },
  };

  const fetchLeaderboard = async () => {
    const params = new URLSearchParams();
    if (classFilter) params.append("class", classFilter);
    if (subjectFilter) params.append("subject", subjectFilter);
    if (chapterFilter) params.append("chapter", chapterFilter);

    try {
      const res = await fetch(`http://localhost:4000/api/leaderboard?${params}`);
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
      setData([]);
    }
  };

  const fetchCurrentResult = async () => {
    if (rollNumber && classFilter && subjectFilter && chapterFilter) {
      try {
        const res = await fetch(
          `http://localhost:4000/api/result/current?rollNumber=${rollNumber}&class=${classFilter}&subject=${subjectFilter}&chapter=${chapterFilter}`
        );
        const result = await res.json();
        setCurrentResult(result);
      } catch (err) {
        setCurrentResult(null);
      }
    } else {
      setCurrentResult(null);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchCurrentResult();
  }, [classFilter, subjectFilter, chapterFilter]);

  const getBadge = (score) => {
    if (score >= 5) return "🥇";
    if (score >= 4) return "🥈";
    if (score >= 3) return "🥉";
    return "⭐";
  };

  const chapterOptions = chapterMap[classFilter]?.[subjectFilter] || [];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-box">
        <h2>🏆 Leaderboard</h2>

        <div style={{ marginBottom: "10px" }}>
          <button className="page-button" onClick={() => navigate("/dashboard")}>🏠 Home</button>
        </div>

        <div className="leaderboard-filters">
          <select className="leaderboard-select" onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {[1, 2, 3, 4, 5].map((cls) => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>

          <select className="leaderboard-select" onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="">All Subjects</option>
            <option value="english">English</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="geography">Geography</option>
          </select>

          <select
            className="leaderboard-select"
            onChange={(e) => setChapterFilter(e.target.value)}
            disabled={!chapterOptions.length}
          >
            <option value="">All Chapters</option>
            {chapterOptions.map((ch, i) => (
              <option key={i} value={ch}>{ch}</option>
            ))}
          </select>
        </div>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Roll No</th>
              <th>Score</th>
              <th>Time (s)</th>
              <th>Badge</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const isCurrent =
                currentResult &&
                row._id === currentResult.studentRollNumber &&
                row.class === currentResult.class &&
                row.subject === currentResult.subject &&
                row.chapter === currentResult.chapter &&
                row.bestScore === currentResult.score &&
                row.bestTime === currentResult.timeTaken;

              const isCurrentOnly =
                currentResult && row._id === currentResult.studentRollNumber;

              return (
                <tr
                  key={row._id}
                  className={isCurrentOnly ? "leaderboard-highlighted" : ""}
                >
                  <td>{idx + 1}</td>
                  <td>{row._id}</td>
                  <td>{row.bestScore}</td>
                  <td>{row.bestTime}</td>
                  <td>{getBadge(row.bestScore)}</td>
                  <td>{isCurrent ? "Current" : row._id === currentResult?.studentRollNumber ? "Best" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Certificate section */}
        {currentResult ? (
          currentResult.score >= 3 ? (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <h3>🎉 You're eligible for a certificate!</h3>
              <button
                className="page-button"
                onClick={() =>
                  navigate("/certificate", {
                    state: {
                      studentName: currentResult.studentName || localStorage.getItem("studentName"),
                      subject: subjectFilter,
                      chapter: chapterFilter,
                      score: currentResult.score,
                      timeTaken: currentResult.timeTaken,
                      studentClass: classFilter,
                      rollNumber: rollNumber,
                    },
                  })
                }
              >
                Download Certificate
              </button>
            </div>
          ) : (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <h3>❌ Not eligible for certificate. Score must be at least 3.</h3>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}