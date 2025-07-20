import { useEffect, useState } from "react";
import MCQForm from "../components/MCQForm";
import "./AdminPage.css";

export default function AdminPage() {
  const [mcqs, setMcqs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("useEffect started");

    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    if (!token) {
      console.warn("No token found; setting error");
      setError("You must be logged in to view your MCQs.");
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
        if (!res.ok) {
          throw new Error("Failed to fetch MCQs");
        }
        return res.json();
      })
      .then((data) => setMcqs(data))
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
