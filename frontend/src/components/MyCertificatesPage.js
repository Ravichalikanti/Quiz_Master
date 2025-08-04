import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function MyCertificates() {
  const [certs, setCerts] = useState([]);
  const navigate = useNavigate();
  const rollNumber = localStorage.getItem("rollNumber");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/results/all?rollNumber=${rollNumber}`);
        const data = await res.json();
        setCerts(data);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setCerts([]);
      }
    };

    fetchCertificates();
  }, [rollNumber]);

  return (
    <div className="certificate-list-container">
      <h2 style={{ textAlign: "center" }}>📜 My Certificates</h2>
      {certs.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No certificates found yet.</p>
      ) : (
        certs.map((cert, i) => (
          <div key={i} className="certificate-card">
            <p>
              <strong>Subject:</strong> {cert.subject} | <strong>Chapter:</strong> {cert.chapter}
            </p>
            <p>
              <strong>Score:</strong> {cert.score} / 5 | <strong>Time:</strong> {cert.timeTaken}s
            </p>
            <button
              className="page-button"
              onClick={() =>
                navigate("/certificate", {
                  state: {
                    studentName: localStorage.getItem("studentName") || rollNumber,
                    subject: cert.subject,
                    chapter: cert.chapter,
                    score: cert.score,
                    timeTaken: cert.timeTaken,
                    studentClass: cert.class,
                    rollNumber,
                  },
                })
              }
            >
              🎓 View Certificate
            </button>
          </div>
        ))
      )}
    </div>
  );
}