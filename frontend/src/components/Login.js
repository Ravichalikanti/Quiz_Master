import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, identifier, password }),
      });

      const data = await res.json();

      if (res.ok && data.message === "Login successful") {
        localStorage.setItem("rollNumber", identifier);
        localStorage.setItem("role", role); // ✅ Store role here

        if (data.firstName && data.lastName) {
          const fullName = `${data.firstName} ${data.lastName}`;
          localStorage.setItem("studentName", fullName);
        }

        if (role === "student") {
          navigate("/dashboard");
        } else if (role === "admin") {
          navigate("/admin");
        }
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="quiz-box">
        <h2>
          <img
            src="https://www.pngmart.com/files/19/Quiz-Logo-PNG-Photos.png"
            height={40}
            alt="Quiz Logo"
          />
        </h2>

        <div className="role-switch-box">
          <div
            className={`role-option ${role === "student" ? "selected-role" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </div>
          <div
            className={`role-option ${role === "admin" ? "selected-role" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </div>
        </div>

        <h2>Login</h2>

        <input
          className="input-box"
          type="text"
          placeholder={role === "admin" ? "Admin Name" : "Roll Number"}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        /><br />

        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="page-button" onClick={handleLogin}>
          Login
        </button>

        {role === "student" && (
          <p style={{ marginTop: "10px" }}>
            New user?{" "}
            <a href="#" onClick={() => navigate("/signup")}>
              Sign Up
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
