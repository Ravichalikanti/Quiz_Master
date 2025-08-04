import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentStats = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/statistics").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        📊 Student Statistics
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" label={{ value: "Subjects", position: "bottom", offset: 20 }} />
          <YAxis label={{ value: "Avg Score", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageScore" fill="#8884d8" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentStats;
