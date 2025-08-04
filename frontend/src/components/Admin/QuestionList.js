import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionList.css";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios.get("http://localhost:4000/api/admin/questions")
      .then(res => setQuestions(res.data))
      .catch(err => {
        console.error("Failed to fetch questions", err);
        setQuestions([]);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/questions/${id}`);
      fetchQuestions(); // Refresh after delete
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  return (
    <div className="question-table-container">
      <h2>📋 All Questions</h2>

      {questions.length === 0 ? (
        <p className="no-questions">No questions available.</p>
      ) : (
        <table className="question-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Options</th>
              <th>Answer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q._id || idx}>
                <td>{idx + 1}</td>
                <td>{q.question}</td>
                <td>
                  <ul className="option-list">
                    {q.options.map((opt, i) => (
                      <li key={i}><strong>{String.fromCharCode(65 + i)}.</strong> {opt}</li>
                    ))}
                  </ul>
                </td>
                <td>{q.answer}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(q._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
