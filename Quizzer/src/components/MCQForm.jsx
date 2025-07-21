import { useState } from "react";

export default function MCQForm({ onMCQAdded }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!question.trim()) {
      setError("Question cannot be empty.");
      setIsSubmitting(false);
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      setError("All options must be filled.");
      setIsSubmitting(false);
      return;
    }
    if (new Set(options).size !== options.length) {
      setError("Options must be unique.");
      setIsSubmitting(false);
      return;
    }
    if (correctIndex === null || !options[correctIndex]) {
      setError("You must select the correct answer.");
      setIsSubmitting(false);
      return;
    }

    const correctAnswer = options[correctIndex];
    const mcq = { question, options, correctAnswer };

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      setIsSubmitting(false);
      return;
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
        setSuccess("MCQ added successfully! 🎉");

        if (onMCQAdded && data.mcq) {
          onMCQAdded(data.mcq);
        }

        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(null);

        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.msg || "Failed to submit MCQ");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(null);
    setError("");
    setSuccess("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="message message-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="message message-success">
          <span>✅</span>
          {success}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Question</label>
        <textarea
          className="form-input form-textarea"
          placeholder="Enter your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Options</label>
        {options.map((opt, idx) => (
          <div key={idx} style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  background: "#1e3c72",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#6b7280",
                  fontWeight: "500",
                  minWidth: "80px",
                }}
              >
                Option {idx + 1}
              </span>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder={`Enter option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
              style={{ marginBottom: "8px" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "47px",
              }}
            >
              <input
                type="radio"
                name="correctAnswer"
                checked={correctIndex === idx}
                onChange={() => setCorrectIndex(idx)}
                style={{
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                  accentColor: "#1e3c72",
                }}
              />
              <span
                style={{
                  fontSize: "0.95rem",
                  color: correctIndex === idx ? "#10b981" : "#6b7280",
                  fontWeight: correctIndex === idx ? "600" : "400",
                }}
              >
                {correctIndex === idx ? "✓ Correct Answer" : "Mark as correct"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "30px",
        }}
      >
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            flex: 1,
            height: "6vh",
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Adding MCQ..." : "Add MCQ"}
        </button>
      </div>
    </form>
  );
}
