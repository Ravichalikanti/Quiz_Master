import React, { use, useState,useEffect } from "react";
import UploadMCQ from "./UploadMCQ";
import StudentStats from "./StudentStats";
import StudentList from "./StudentList";
import QuestionList from "./QuestionList";
import AddQuestionManual from "./AddQuestionManual";
import DashboardHome from "./DashboardHome";
import "./AdminLayout.css"; // Make sure this is imported

const AdminLayout = () => {
  const [page, setPage] = useState("dashboard");

  const renderContent = () => {
    switch (page) {
      case "upload": return <UploadMCQ />;
      case "students": return <StudentList />;
      case "stats": return <StudentStats />;
      case "questions": return <QuestionList />;
      case "add-question": return <AddQuestionManual />;
      default: return <DashboardHome/>;
    }
  };
  // useEffect(()=>{
  //   switch (page) {
  //     case "upload": return <UploadMCQ />;
  //     case "students": return <StudentList />;
  //     case "stats": return <StudentStats />;
  //     case "questions": return <QuestionList />;
  //     case "add-question": return <AddQuestionManual />;
  //     default: return <DashboardHome/>;
  //   }

  // },[page])

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h3>📋 Admin Menu</h3>
        <ul>
          <li onClick={() => setPage("dashboard")}>🏠 Dashboard Home</li>
          <li onClick={() => setPage("upload")}>📄 Upload MCQs (PDF)</li>
          <li onClick={() => setPage("add-question")}>➕ Add Question Manually</li>
          <li onClick={() => setPage("questions")}>📋 All Questions</li>
          <li onClick={() => setPage("students")}>👨‍🎓 Students</li>
          <li onClick={() => setPage("stats")}>📊 Statistics</li>
        </ul>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
