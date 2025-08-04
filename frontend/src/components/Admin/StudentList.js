import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLayout.css";
import './StudentList.css'; // Ensure you have this CSS file for styling

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [chapterFilter, setChapterFilter] = useState("");

  const chapterMap = {
    "1": { english: ["Alphabet", "Basic Words", "Colors"], math: ["Counting", "Shapes", "Numbers up to 100"], science: ["Parts of the Body", "Living and Non-Living", "Our Surroundings"], geography: ["Our Earth", "Weather", "Directions"] },
    "2": { english: ["Sentences", "Nouns", "Verbs"], math: ["Numbers up to 1000", "Addition and Subtraction", "Multiplication Basics"], science: ["Plants", "Animals", "Weather"], geography: ["Our Country", "Seasons", "Maps"] },
    "3": { english: ["Adjectives", "Pronouns", "Tenses"], math: ["Fractions", "Time", "Multiplication and Division"], science: ["Human Body", "Water", "Light"], geography: ["India", "Continents", "Oceans"] },
    "4": { english: ["Nouns", "Verbs", "Adjectives"], math: ["Decimals", "Perimeter and Area", "Angles"], science: ["Plants", "Animals", "Human Body"], geography: ["Continents and Oceans", "Mountains and Valleys", "Rivers and Lakes"] },
    "5": { english: ["Tenses", "Prepositions", "Conjunctions"], math: ["Fractions", "Decimals", "Geometry"], science: ["Human Body", "Plants", "Earth and Space"], geography: ["Continents", "Oceans", "Landforms"] },
  };

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/students")
      .then(res => {
        setStudents(res.data.summary);
        setFiltered(res.data.summary);
      })
      .catch(err => {
        console.error("Error fetching student data", err);
        setStudents([]);
        setFiltered([]);
      });
  }, []);

  useEffect(() => {
    const f = students.filter(s => {
      return (!classFilter || s.class === classFilter) &&
             (!subjectFilter || s.subject === subjectFilter) &&
             (!chapterFilter || s.chapter === chapterFilter);
    });
    setFiltered(f);
  }, [classFilter, subjectFilter, chapterFilter, students]);

  const chapterOptions = classFilter && subjectFilter
    ? chapterMap[classFilter]?.[subjectFilter] || []
    : [];

  return (
    <div className="admin-panel-container">
      <h2>📊 Student Performance</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}>
          <option value="">All Classes</option>
          {[1, 2, 3, 4, 5].map(cls => (
            <option key={cls} value={cls}>{`Class ${cls}`}</option>
          ))}
        </select>

        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
          <option value="">All Subjects</option>
          <option value="english">English</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="geography">Geography</option>
        </select>

        <select
          value={chapterFilter}
          onChange={e => setChapterFilter(e.target.value)}
          disabled={!chapterOptions.length}
        >
          <option value="">All Chapters</option>
          {chapterOptions.map((chapter, idx) => (
            <option key={idx} value={chapter}>{chapter}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Chapter</th>
            <th>Score</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((student, idx) => (
              <tr key={idx}>
                <td>{student.name}</td>
                <td>{student.roll}</td>
                <td>{student.class}</td>
                <td>{student.subject}</td>
                <td>{student.chapter}</td>
                <td>{student.score}</td>
                <td>{student.time}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No matching students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
