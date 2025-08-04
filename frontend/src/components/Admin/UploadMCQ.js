import React, { useState } from "react";

export default function UploadMCQ() {
  const [pdf, setPdf] = useState(null);
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [chapter, setChapter] = useState("");
  const [message, setMessage] = useState("");

  const chaptersByClassAndSubject = {
    "1": {
      english: ["Alphabet", "Basic Words", "Colors"],
      math: ["Counting", "Shapes", "Numbers up to 100"],
      science: ["Parts of the Body", "Living and Non-Living", "Our Surroundings"],
      geography: ["Our Earth", "Weather", "Directions"],
    },
    "2": {
      english: ["Sentences", "Nouns", "Verbs"],
      math: ["Numbers up to 1000", "Addition and Subtraction", "Multiplication Basics"],
      science: ["Plants", "Animals", "Weather"],
      geography: ["Our Country", "Seasons", "Maps"],
    },
    "3": {
      english: ["Adjectives", "Pronouns", "Tenses"],
      math: ["Fractions", "Time", "Multiplication and Division"],
      science: ["Human Body", "Water", "Light"],
      geography: ["India", "Continents", "Oceans"],
    },
    "4": {
      english: ["Nouns", "Verbs", "Adjectives"],
      math: ["Decimals", "Perimeter and Area", "Angles"],
      science: ["Plants", "Animals", "Human Body"],
      geography: ["Continents and Oceans", "Mountains and Valleys", "Rivers and Lakes"],
    },
    "5": {
      english: ["Tenses", "Prepositions", "Conjunctions"],
      math: ["Fractions", "Decimals", "Geometry"],
      science: ["Human Body", "Plants", "Earth and Space"],
      geography: ["Continents", "Oceans", "Landforms"],
    },
  };

  const handleUpload = async () => {
    if (!pdf || !subject || !className || !chapter) {
      setMessage("❗ Please select subject, class, chapter, and PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("subject", subject);
    formData.append("className", className);
    formData.append("chapter", chapter);

    try {
      const res = await fetch("http://localhost:4000/api/admin/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message || "✅ Upload complete");
    } catch (err) {
      setMessage("❌ Upload failed. Try again.");
    }
  };

  const subjects = className ? Object.keys(chaptersByClassAndSubject[className]) : [];
  const chapters = className && subject ? chaptersByClassAndSubject[className][subject] : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📄 Upload MCQ PDF</h2>

      {/* Class Dropdown */}
      <select style={styles.dropdown} value={className} onChange={e => {
        setClassName(e.target.value);
        setSubject("");
        setChapter("");
      }}>
        <option value="">-- Select Class --</option>
        {Object.keys(chaptersByClassAndSubject).map(cls => (
          <option key={cls} value={cls}>Class {cls}</option>
        ))}
      </select>

      {/* Subject Dropdown */}
      {className && (
        <select style={styles.dropdown} value={subject} onChange={e => {
          setSubject(e.target.value);
          setChapter("");
        }}>
          <option value="">-- Select Subject --</option>
          {subjects.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      )}

      {/* Chapter Dropdown */}
      {subject && (
        <select style={styles.dropdown} value={chapter} onChange={e => setChapter(e.target.value)}>
          <option value="">-- Select Chapter --</option>
          {chapters.map((ch, index) => (
            <option key={index} value={ch}>{ch}</option>
          ))}
        </select>
      )}

      {/* PDF Upload */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setPdf(e.target.files[0])}
        style={styles.fileInput}
      />

      <button onClick={handleUpload} style={styles.button}>⬆️ Upload</button>

      {message && (
        <p style={{ ...styles.message, color: message.includes("❌") || message.includes("❗") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    border: "1px solid #ccc",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "40px auto",
    backgroundColor: "#fdfdfd",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    color: "#333",
  },
  dropdown: {
    width: "100%",
    padding: "10px",
    marginBottom: "1rem",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  fileInput: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "1rem",
    width: "100%",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007BFF",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  },
  message: {
    marginTop: "15px",
    fontWeight: "500",
    fontSize: "14px",
  },
};
