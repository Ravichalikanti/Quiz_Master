import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function LessonSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");
  const selectedSubject = params.get("subject")?.toLowerCase();

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

  const handleChapterChange = (e) => {
    const chapter = e.target.value;
    if (chapter) {
      navigate(
        `/quiz?class=${selectedClass}&subject=${selectedSubject}&chapter=${chapter}`
      );
    }
  };

  const chapters =
    chaptersByClassAndSubject[selectedClass]?.[selectedSubject] || [];

  return (
    <div className="container">
      <div className="quiz-box">
        <h2>Select Chapter</h2>
        <select className="input-box" onChange={handleChapterChange}>
          <option value="">-- Choose Chapter --</option>
          {chapters.map((chapter, index) => (
            <option key={index} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
