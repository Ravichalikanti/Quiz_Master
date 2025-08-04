import React, { useState } from "react";
import axios from 'axios';

const chapterMap = {
  "1": { english: ["Alphabet", "Basic Words", "Colors"], math: ["Counting", "Shapes"], science: ["Parts of the Body", "Living and Non-Living"], geography: ["Our Earth"] },
  "2": { english: ["Sentences", "Nouns"], math: ["Numbers up to 1000", "Addition"], science: ["Plants", "Animals"], geography: ["Our Country"] },
  "3": { english: ["Tenses", "Pronouns"], math: ["Fractions", "Time"], science: ["Water", "Light"], geography: ["India", "Continents"] },
  "4": { english: ["Verbs", "Adjectives"], math: ["Decimals", "Area"], science: ["Human Body"], geography: ["Oceans", "Mountains"] },
  "5": { english: ["Tenses", "Prepositions"], math: ["Fractions", "Geometry"], science: ["Earth and Space"], geography: ["Landforms"] },
};

export default function AddQuestionManual() {
  const [cls, setCls] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
  if (!cls || !subject || !chapter || !question || options.some(opt => !opt) || !answer) {
    setMessage("❌ Please fill all fields.");
    return;
  }

  try {
    const res = await axios.post("http://localhost:4000/api/admin/add-question", {
      class: cls,
      subject,
      chapter,
      question,
      options,
      answer,
    });

    // ✅ axios handles JSON parsing automatically, so use res.data
    setMessage(res.data.message || "✅ Question added.");
    setCls("");
    setSubject("");
    setChapter("");
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
  } catch (err) {
    console.error(err);
    setMessage("❌ Failed to add question.");
  }
};


  const chapterOptions = cls && subject ? chapterMap[cls]?.[subject]  : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>➕ Add MCQ</h2>

      <label style={styles.label}>Class:</label>
      <select value={cls} onChange={(e) => setCls(e.target.value)} style={styles.input}>
        <option value="">-- Select Class --</option>
        {[1, 2, 3, 4, 5].map(c => (
          <option key={c} value={c}>{`Class ${c}`}</option>
        ))}
      </select>

      <label style={styles.label}>Subject:</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)} style={styles.input}>
        <option value="">-- Select Subject --</option>
        <option value="english">English</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="geography">Geography</option>
      </select>

      <label style={styles.label}>Chapter:</label>
      <select value={chapter} onChange={(e) => setChapter(e.target.value)} style={styles.input} disabled={!chapterOptions.length}>
        <option value="">-- Select Chapter --</option>
        {chapterOptions.map((ch, idx) => (
          <option key={idx} value={ch}>{ch}</option>
        ))}
      </select>

      <label style={styles.label}>Question:</label>
      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter question"
        style={styles.textarea}
      />

      {options.map((opt, idx) => (
        <div key={idx}>
          <label style={styles.label}>Option {idx + 1}:</label>
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const updated = [...options];
              updated[idx] = e.target.value;
              setOptions(updated);
            }}
            placeholder={`Enter option ${idx + 1}`}
            style={styles.input}
          />
        </div>
      ))}

      <label style={styles.label}>Correct Answer:</label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Enter correct answer"
        style={styles.input}
      />

      <button onClick={handleAdd} style={styles.button}>➕ Add Question</button>

      {message && (
        <p style={{ marginTop: "12px", color: message.includes("Error") ? "red" : "green" }}>
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
    maxWidth: "600px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  heading: {
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontWeight: "600",
    display: "block",
    marginBottom: "6px",
    marginTop: "12px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
    width: "100%",
  },
};
