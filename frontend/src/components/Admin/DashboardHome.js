import { useEffect, useState } from "react";
import './DashBoardHome.css';
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardHome = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/summary")
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error(err));
  }, []);

  if (!summary) {
    return <div className="skeleton-loader">Loading Dashboard...</div>;
  }

  const subjectLabels = Object.keys(summary.subjectCounts);
  const subjectData = Object.values(summary.subjectCounts);
  const classLabels = Object.keys(summary.classCounts);
  const classData = Object.values(summary.classCounts);
  const topSubject = subjectLabels[subjectData.indexOf(Math.max(...subjectData))];

  return (
    <div className="dashboard-container">
      <svg className="illusion-bg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="gray" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="30" stroke="lightgray" strokeWidth="2" fill="none" />
      </svg>

      <h2 className="welcome">Welcome to the Admin Dashboard</h2>

      <div className="summary-cards">
        <div className="card">📘 Total Questions: <strong>{summary.totalQuestions}</strong></div>
        <div className="card">👨‍🎓 Total Students: <strong>{summary.totalStudents}</strong></div>
        <div className="card">📚 Subjects: <strong>{subjectLabels.length}</strong></div>
        <div className="card">🎯 Top Subject: <strong>{topSubject}</strong></div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h4>Questions per Subject</h4>
          <Bar
            data={{
              labels: subjectLabels,
              datasets: [{
                label: "Questions",
                data: subjectData,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              elements: {
                bar: {
                  borderRadius: 5,
                  borderSkipped: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        <div className="chart-box">
          <h4>Students per Class</h4>
          <Pie
            data={{
              labels: classLabels,
              datasets: [{
                data: classData,
                backgroundColor: [
                  "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff", "#ff9f40"
                ]
              }]
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
