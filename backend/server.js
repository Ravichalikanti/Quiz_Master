const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/quiz-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("✅ MongoDB connected.");
});

// ✅ SCHEMAS
const StudentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  rollNumber: String,
  password: String,
});
const Student = mongoose.model("Student", StudentSchema);

const QuestionSchema = new mongoose.Schema({
  class: String,
  subject: String,
  chapter: String,
  question: String,
  options: [String],
  answer: String,
});
const Question = mongoose.model("Question", QuestionSchema);

const ResultSchema = new mongoose.Schema({
  studentRollNumber: String,
  studentName: String,
  class: String,
  subject: String,
  chapter: String,
  score: Number,
  timeTaken: Number,
  createdAt: { type: Date, default: Date.now },
});
const Result = mongoose.model("Result", ResultSchema);

// ✅ PDF → MCQ Extractor
function extractMCQs(text, cls, subject, chapter) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const mcqs = [];

  for (let i = 0; i < lines.length; i++) {
    if (/^\d+\./.test(lines[i])) {
      const question = lines[i].replace(/^\d+\.\s*/, '');
      const options = [];
      for (let j = 1; j <= 4 && i + j < lines.length; j++) {
        const match = lines[i + j].match(/^[A-Da-d][)\.]\s*(.*)/);
        if (match) options.push(match[1]);
      }
      if (options.length === 4) {
        mcqs.push({
          class: cls,
          subject,
          chapter,
          question,
          options,
          answer: options[0], // You can improve this by extracting the correct option if marked
        });
        i += 4;
      }
    }
  }
  return mcqs;
}

// Multer setup
const upload = multer({ dest: "uploads/" });

// Admin: Upload PDF and parse MCQs
app.post("/api/admin/upload-pdf", upload.single("pdf"), async (req, res) => {
  const { subject, className, chapter } = req.body;
  if (!req.file || !subject || !className || !chapter) {
    return res.status(400).json({ message: "Missing file or data." });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);
    const questions = extractMCQs(data.text, className, subject, chapter);

    await Question.insertMany(questions);
    fs.unlinkSync(req.file.path); // Remove uploaded PDF after parsing
    res.json({ message: `${questions.length} MCQs uploaded.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to parse PDF or save questions." });
  }
});


// ✅ Multer Setup
//const upload = multer({ dest: "uploads/" });

/* --------------------------- ADMIN ROUTES --------------------------- */

// Upload PDF and parse MCQs

app.get("/api/admin/statistics", async (req, res) => {
  try {
    const results = await Result.find();

    const subjectScores = {};

    results.forEach((r) => {
      const subject = r.subject;
      if (!subjectScores[subject]) {
        subjectScores[subject] = { totalScore: 0, count: 0 };
      }
      subjectScores[subject].totalScore += r.score;
      subjectScores[subject].count += 1;
    });

    const stats = Object.keys(subjectScores).map((subject) => ({
      subject,
      averageScore: parseFloat((subjectScores[subject].totalScore / subjectScores[subject].count).toFixed(2)),
    }));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error loading statistics." });
  }
});

// app.post("/api/admin/upload-pdf", upload.single("pdf"), async (req, res) => {
//   const { subject, className, chapter } = req.body;

//   if (!req.file || !subject || !className || !chapter) {
//     return res.status(400).json({ message: "Missing data" });
//   }

//   try {
//     const dataBuffer = req.file.buffer;
//     const data = await pdfParse(dataBuffer);

//     const questions = extractMCQs(data.text);

//     for (const q of questions) {
//       await Question.create({
//         question: q.question,
//         options: q.options,
//         answer: q.answer,
//         subject,
//         className,
//         chapter,
//       });
//     }

//     res.json({ message: "✅ MCQs uploaded successfully." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "❌ Failed to parse PDF or save data." });
//   }
// });


// Save parsed MCQs
app.post("/api/admin/save-mcqs", async (req, res) => {
  const { mcqs } = req.body;
  try {
    await Question.insertMany(mcqs);
    res.json({ message: `${mcqs.length} questions saved.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Saving MCQs failed." });
  }
});

// Add MCQ manually
// Add MCQ manually with class, subject, chapter
app.post("/api/admin/add-question", async (req, res) => {
  const { class: cls, subject, chapter, question, options, answer } = req.body;
  if (!cls || !subject || !chapter || !question || !options || !answer) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    await Question.create({ class: cls, subject, chapter, question, options, answer });
    res.json({ message: "Question added." });
  } catch (err) {
    res.status(500).json({ message: "Failed to add question." });
  }
});


// Get all questions
app.get("/api/admin/questions", async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// Get student performance data
app.get("/api/admin/students", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    const summary = results.map(r => ({
      name: r.studentName,
      roll: r.studentRollNumber,
      class: r.class,
      subject: r.subject,
      chapter: r.chapter,
      score: r.score,
      time: r.timeTaken,
    }));
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Error loading students." });
  }
});

/* --------------------------- STUDENT ROUTES --------------------------- */

// Register student
app.post("/api/student/signup", async (req, res) => {
  const { firstName, lastName, rollNumber, password } = req.body;
  try {
    const exists = await Student.findOne({ rollNumber});
    if (exists) return res.status(400).json({ message: "User already exists" });
    await Student.create({ firstName, lastName, rollNumber, password });
    res.json({ message: "Signup successful" });
  } catch {
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { role, identifier, password } = req.body;

  try {
    if (role === "admin") {
      if (identifier === "admin" && password === "admin123") {
        return res.json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
    }

    // For student login
    const user = await Student.findOne({ rollNumber: identifier });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid student credentials" });
    }

    res.json({
      message: "Login successful",
      firstName: user.firstName,
      lastName: user.lastName,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// Get quiz questions
app.get("/api/student/questions", async (req, res) => {
  const { class: cls, subject, chapter } = req.query;
  try {
    const qns = await Question.find({ class: cls, subject, chapter });
    res.json(qns);
  } catch {
    res.status(500).json({ message: "Error fetching questions." });
  }
});
// Example schema assumption: StudentResults or Results collection


app.post("/api/results", async (req, res) => {
  const { studentRollNumber, class: cls, subject, chapter, score, timeTaken } = req.body;
  const student = await Student.findOne({ rollNumber: studentRollNumber });
  const studentName = student ? `${student.firstName} ${student.lastName}` : studentRollNumber;

  const existing = await Result.findOne({ studentRollNumber, class: cls, subject, chapter });

  if (!existing || score > existing.score) {
    await Result.findOneAndUpdate(
      { studentRollNumber, class: cls, subject, chapter },
      {
        studentRollNumber,
        studentName,
        class: cls,
        subject,
        chapter,
        score,
        timeTaken,
        createdAt: new Date(),
      },
      { upsert: true }
    );
  }

  res.json({ message: "Result saved" });
});

// 🏆 Leaderboard (based on best scores)
app.get("/api/leaderboard", async (req, res) => {
  const { class: cls, subject, chapter } = req.query;

  try {
    const results = await Result.aggregate([
      {
        $match: {
          ...(cls && { class: cls }),
          ...(subject && { subject }),
          ...(chapter && { chapter }),
        },
      },
      { $sort: { score: -1, timeTaken: 1 } },
      {
        $group: {
          _id: "$studentRollNumber",
          class: { $first: "$class" },
          subject: { $first: "$subject" },
          chapter: { $first: "$chapter" },
          bestScore: { $first: "$score" },
          bestTime: { $first: "$timeTaken" },
        },
      },
      { $sort: { bestScore: -1, bestTime: 1 } },
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// 🧾 Get CURRENT quiz result (for certificate)
app.get("/api/result/current", async (req, res) => {
  const { rollNumber, class: cls, subject, chapter } = req.query;

  try {
    const result = await Result.findOne({
      studentRollNumber: rollNumber,
      class: cls,
      subject,
      chapter,
    });

    if (!result) return res.status(404).json({ message: "No result found" });
    res.json(result);
  } catch (err) {
    console.error("Error fetching current result:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🎓 Student Info
app.get("/api/student", async (req, res) => {
  const rollNumber = req.query.rollNumber;
  try {
    const student = await Student.findOne({ rollNumber });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// 🔄 Get all results for student (for MyCertificates page)
app.get('/api/admin/summary', async (req, res) => {
  const questions = await Question.find({});
  const students = await Student.find({});

  const subjectCounts = {};
  const classCounts = {};

  questions.forEach(q => {
    subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
  });

  students.forEach(s => {
    classCounts[s.class] = (classCounts[s.class] || 0) + 1;
  });

  res.json({
    totalQuestions: questions.length,
    totalStudents: students.length,
    subjectCounts,
    classCounts,
  });
});
app.get("/api/results/all", async (req, res) => {
  const { rollNumber } = req.query;
  try {
    const results = await Result.find({ studentRollNumber: rollNumber });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
});
app.delete('/api/admin/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question" });
  }
});


/* ---------------------------- SERVER START ---------------------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
