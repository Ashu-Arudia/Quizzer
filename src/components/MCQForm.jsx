import { useState } from "react";

export default function MCQForm() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
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

    // ✅ Validation
    if (!question.trim()) return setError("Question cannot be empty.");
    if (options.some((opt) => !opt.trim()))
      return setError("All options must be filled.");
    if (new Set(options).size !== options.length)
      return setError("Options must be unique.");
    if (!options.includes(correctAnswer))
      return setError("Correct answer must match one of the options.");

    const mcq = { question, options, correctAnswer };

    const token = localStorage.getItem("token");
    if (!token) {
      return setError("User not authenticated. Please log in again.");
    }

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
        // Clear form
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectAnswer("");
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
        <div key={idx}>
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
          <br />
          <br />
        </div>
      ))}

      <input
        type="text"
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      />
      <br />
      <br />

      <button type="submit">Submit MCQ</button>
    </form>
  );
}
