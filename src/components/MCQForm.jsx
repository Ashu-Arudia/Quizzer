import { useState } from "react";

export default function MCQForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!question.trim()) return setError("Question cannot be empty.");
    if (options.some((opt) => !opt.trim()))
      return setError("All options must be filled.");
    if (new Set(options).size !== options.length)
      return setError("Options must be unique.");
    if (correctIndex === null || !options[correctIndex])
      return setError("You must select the correct answer.");

    const correctAnswer = options[correctIndex];
    const mcq = { question, options, correctAnswer };

    const token = localStorage.getItem("token");
    if (!token) return setError("User not authenticated. Please log in again.");

    try {
      const response = await fetch("http://localhost:8000/api/mcq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mcq),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("MCQ submitted successfully!");
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(null);
      } else {
        setError(data.msg || "Failed to submit MCQ");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New MCQ</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <br />
      <br />

      {options.map((opt, idx) => (
        <div key={idx} style={{ marginBottom: "10px", display: "flex" }}>
          <div style={{ padding: "8px", fontWeight: "bold" }}>{idx + 1}</div>
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
            style={{ width: "300px" }}
          />
          <input
            type="radio"
            name="correctAnswer"
            checked={correctIndex === idx}
            onChange={() => setCorrectIndex(idx)}
            style={{ marginRight: "4px" }}
          />
        </div>
      ))}

      <button type="submit">Submit MCQ</button>
    </form>
  );
}
