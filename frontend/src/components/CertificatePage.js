import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../App.css";

export default function CertificatePage() {
  const { state } = useLocation();
  const certRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const downloadCertificate = () => {
    html2canvas(certRef.current, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("certificate.pdf");
    });
  };

  if (!state) return <h2 style={{ textAlign: "center" }}>No certificate data found.</h2>;
  if (loading) return <h2 style={{ textAlign: "center" }}>Loading certificate...</h2>;

  const {
    studentName,
    subject,
    chapter,
    score,
    timeTaken,
    studentClass,
    rollNumber,
  } = state;

  return (
    <div className="certificate-wrapper">
      <div className="certificate-box" ref={certRef}>
       <img src="/cert-bg.png" alt="Certificate Background" className="certificate-bg" />
        <div className="certificate-content">
          <h1 className="certificate-title">Certificate of Excellence</h1>
          <p className="certificate-line">🏅 This is proudly presented to</p>
         <h2 className="certificate-name">{studentName.toUpperCase()}</h2>


          <p className="certificate-line">
            For outstanding performance in <strong>{subject}</strong> - <strong>{chapter}</strong>
            <br />Class: {studentClass} &nbsp; | &nbsp; Roll No: {rollNumber}
          </p>

          <p className="certificate-line">Score: <strong>{score}</strong> / 5 &nbsp; | &nbsp; Time: {timeTaken} sec</p>

          <p className="certificate-line" style={{ marginTop: "10px" }}>
            🗓 Date of Achievement: {new Date().toLocaleDateString()}
          </p>

          <p className="certificate-motivation">"Keep up the great work and continue your learning journey!"</p>

          <div className="certificate-signature">
  <div className="signature-name">Quiz-App TEAM</div>
  _________________________
  <br />
  Principal / Admin<br />QuizApp Academy
</div>

        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="page-button" onClick={downloadCertificate}>
          📄 Download PDF
        </button>
        <button className="page-button" onClick={() => navigate("/dashboard")}>
         🏠 Home
         </button>
      </div>
    </div>
  );
}
