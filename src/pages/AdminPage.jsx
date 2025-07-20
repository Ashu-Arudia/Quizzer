import { useEffect, useState } from "react";
import MCQForm from "../components/MCQForm";
import "./AdminPage.css";

export default function AdminPage() {
  const [mcqs, setMcqs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect started");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("Token from localStorage:", token);
    console.log("Role from localStorage:", role);

    if (!token) {
      console.warn("No token found; setting error");
      setError("You must be logged in to view your MCQs.");
      return;
    }

    if (role !== "teacher") {
      console.warn("User is not a teacher; setting error");
      setError(`Access denied: You are logged in as a ${role}, but only teachers can view MCQs.`);
      return;
    }

    console.log("Sending token:", token);

    fetch("http://localhost:8000/api/mcq", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);

        if (!res.ok) {
          return res.json().then(errorData => {
            console.error("Server error response:", errorData);
            throw new Error(errorData.error || "Failed to fetch MCQs");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("MCQs data received:", data);
        setMcqs(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <MCQForm />
      <hr />
      <h3>Your MCQs:</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {mcqs.length === 0 && !error ? (
        <p>No MCQs added yet.</p>
      ) : (
        <ul>
          {mcqs.map((q, index) => (
            <li key={q._id || index}>
              <strong>{q.question}</strong>
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <p>
                <em>Correct: {q.correctAnswer}</em>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
