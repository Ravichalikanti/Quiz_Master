import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async () => {
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !rollNumber || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/student/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, rollNumber, password }),
      });

      const data = await res.json();

      if (res.ok) { 
        setSuccess("Signup successful! You can now login.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <div className="quiz-box">
        <h2>Student Sign Up</h2>

        <input
          className="input-box"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        /><br />

        <input
          className="input-box"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        /><br />

        <input
          className="input-box"
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        /><br />

        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        <input
          className="input-box"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button
        className="page-button"
        onClick={(e) => {
        e.preventDefault(); // 👈 stops the default GET /signup
        handleSignUp();
        }}
        >
        Sign Up
        </button>


        <p style={{ marginTop: "10px" }}>
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/")}>Login</a>
        </p>
      </div>
    </div>
  );
}
