import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

export default function TakeQuiz() {
  const { quizId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/user/${quizId}/questions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load quiz");
        const data = await res.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
        setTimeLeft(data.quiz.timeLimit * 60);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, token]);

  useEffect(() => {
    if (!started || !quiz) return;

    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, started, quiz]);

  const startQuiz = () => {
    setStarted(true);
  };

  const handleSelect = (questionId, optionIdx) => {
    if (!Number.isInteger(optionIdx) || optionIdx < 0 || optionIdx > 3) {
      return;
    }

    setAnswers((prev) => {
      const currentSelections = prev[questionId] || [];
      if (currentSelections.includes(optionIdx)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter((i) => i !== optionIdx),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentSelections, optionIdx],
        };
      }
    });
  };

  const finishQuiz = () => {
    clearInterval(intervalRef.current);

    let correct = 0;
    questions.forEach((q) => {
      const correctOptions = new Set((q.correct || []).map(Number));
      const selectedOptions = new Set(answers[q._id] || []);

      console.log(
        `Question ID: ${q._id}, Correct: ${JSON.stringify([
          ...correctOptions,
        ])}, Selected: ${JSON.stringify([...selectedOptions])}`
      );

      const isCorrect =
        correctOptions.size > 0 &&
        [...correctOptions].every((idx) => selectedOptions.has(idx));

      if (isCorrect) correct++;
    });

    console.log(`Final Score: ${correct}`);
    setScore(correct);
    setStarted(false);
  };

  if (loading || !quiz) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#4b5563",
            animation: "pulse 1.5s infinite",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selected = answers[currentQuestion?._id] || [];

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .start-button:hover {
            background-color: #4338ca;
            transform: scale(1.05);
          }
          .start-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.3);
          }
          .option-label:hover {
            background-color: #f3f4f6;
          }
          .nav-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .nav-button:not(:disabled):hover {
            background-color: #4b5563;
          }
          .nav-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.3);
          }
          .submit-button:hover {
            background-color: #15803d;
          }
          .submit-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.3);
          }
          .back-button:hover {
            background-color: #4338ca;
          }
          .back-button:focus {
            outline: none;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.3);
          }
          @media (min-width: 640px) {
            .quiz-info-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .nav-buttons {
              flex-direction: row;
            }
          }
        `}
      </style>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #f9fafb, #e5e7eb)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2.5rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "64rem",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "1rem",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
            padding: "2rem",
          }}
        >
          {!started && score === null && (
            <div
              style={{
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "linear-gradient(to right, #eef2ff, #e0f2fe)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              <h2
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
                {quiz.name}
              </h2>
              <div
                className="quiz-info-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                <p style={{ color: "#4b5563" }}>
                  <span style={{ fontWeight: "600" }}>Level:</span> {quiz.level}
                </p>
                <p style={{ color: "#4b5563" }}>
                  <span style={{ fontWeight: "600" }}>Time Limit:</span>{" "}
                  {quiz.timeLimit} min
                </p>
                <p style={{ color: "#4b5563" }}>
                  <span style={{ fontWeight: "600" }}>Topics:</span>{" "}
                  {quiz.topics.join(", ")}
                </p>
              </div>
            </div>
          )}

          {!started && score === null && (
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <button
                onClick={startQuiz}
                className="start-button"
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: "rgb(176, 235, 240)",
                  color: "black",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Start Quiz
              </button>
            </div>
          )}

          {started && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: "#374151",
                    backgroundColor: "#f3f4f6",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  Time left:{" "}
                  {`${Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}:${(timeLeft % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </div>
              </div>

              <div
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  animation: "slideUp 0.5s ease-out",
                }}
              >
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Question {currentIndex + 1}/{questions.length}
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "500",
                    color: "#1f2937",
                    marginBottom: "1rem",
                  }}
                >
                  {currentQuestion.text}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {currentQuestion.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className="option-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1rem",
                        border: selected.includes(idx)
                          ? "1px solid #a5b4fc"
                          : "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        backgroundColor: selected.includes(idx)
                          ? "#e0e7ff"
                          : "#f9fafb",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(idx)}
                        onChange={() => handleSelect(currentQuestion._id, idx)}
                        style={{
                          height: "1.25rem",
                          width: "1.25rem",
                          accentColor: "#4f46e5",
                          marginRight: "0.75rem",
                          borderRadius: "0.25rem",
                        }}
                      />
                      <span style={{ color: "#374151" }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div
                className="nav-buttons"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <button
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  className="nav-button"
                  style={{
                    flex: "1",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((i) =>
                      Math.min(questions.length - 1, i + 1)
                    )
                  }
                  disabled={currentIndex === questions.length - 1}
                  className="nav-button"
                  style={{
                    flex: "1",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#6b7280",
                    color: "#ffffff",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Next
                </button>
              </div>
              <button
                onClick={finishQuiz}
                className="submit-button"
                style={{
                  width: "100%",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Submit Quiz
              </button>
            </>
          )}

          {score !== null && (
            <div
              style={{
                marginTop: "2.5rem",
                padding: "2rem",
                background: "linear-gradient(to right, #f0fdf4, #ccfbf1)",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
                Quiz Completed!
              </h3>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#4b5563",
                  marginBottom: "1.5rem",
                }}
              >
                Your Score: <span style={{ fontWeight: "600" }}>{score}</span>{" "}
                out of{" "}
                <span style={{ fontWeight: "600" }}>{questions.length}</span>
              </p>
              <button
                onClick={() => navigate("/student")}
                className="back-button"
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: "600",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
