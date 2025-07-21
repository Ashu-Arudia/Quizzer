import { useEffect, useState } from "react";
import "./StudentPage.css";

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [error, setError] = useState("");

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      setError("");
      try {
        const res = await fetch("http://localhost:8000/api/user/teachers");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTeachers(data.teachers || []);
      } catch (err) {
        setError("Failed to load teachers. Please try again.");
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleSelectTeacher = async (teacher) => {
    if (selectedTeacher?._id === teacher._id) {
      setSelectedTeacher(null);
      setQuestions([]);
      resetQuiz();
      return;
    }
    setSelectedTeacher(teacher);
    setLoadingQuestions(true);
    resetQuiz();
    try {
      const res = await fetch(`http://localhost:8000/api/mcq/${teacher._id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizStarted(false);
    setQuizCompleted(false);
    setResults(null);
    setShowResults(false);
    setSubmitError("");
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = selectedAnswers[currentQuestion._id];
    if (!userAnswer) {
      setSubmitError(
        "Please select an answer for the current question before submitting."
      );
      setTimeout(() => setSubmitError(""), 4000);
      return;
    }
    let correctAnswers = 0;
    const questionResults = questions.map((question) => {
      const userAnswer = selectedAnswers[question._id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        options: question.options,
      };
    });
    const score = correctAnswers;
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const quizResults = {
      score,
      totalQuestions,
      percentage,
      questionResults,
      teacherName: selectedTeacher.email,
    };
    setResults(quizResults);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const exitQuiz = () => {
    resetQuiz();
    setSelectedTeacher(null);
    setQuestions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  // Fullscreen quiz view
  if (quizStarted && !showResults) {
    return (
      <div className="quiz-fullscreen">
        <div className="quiz-header-fullscreen">
          <div className="quiz-info">
            <h1>
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <p>Quiz by {selectedTeacher.email}</p>
          </div>
          <button className="btn-exit-quiz" onClick={exitQuiz}>
            ✕ Exit Quiz
          </button>
        </div>
        <div className="quiz-progress-fullscreen">
          <div className="progress-text">
            Progress: {currentQuestionIndex + 1} / {questions.length} (
            {answeredQuestions} answered)
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="question-container-fullscreen">
          <div className="question-card-fullscreen">
            {submitError && (
              <div
                className="message message-error"
                style={{ marginBottom: 20 }}
              >
                <span>⚠️</span>
                {submitError}
              </div>
            )}
            <p className="question-text">{currentQuestion.question}</p>
            <ul className="mcq-options-fullscreen">
              {currentQuestion.options.map((option, idx) => (
                <li
                  key={idx}
                  className={
                    selectedAnswers[currentQuestion._id] === option
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    handleAnswerSelect(currentQuestion._id, option)
                  }
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="quiz-navigation-fullscreen">
          <button
            className="btn btn-secondary"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={goToNextQuestion}
                disabled={!selectedAnswers[currentQuestion._id]}
              >
                Next →
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={submitQuiz}
                disabled={!selectedAnswers[currentQuestion._id]}
              >
                🎯 Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen results view
  if (showResults) {
    return (
      <div className="results-fullscreen">
        <div className="results-header-fullscreen">
          <h1>Quiz Results</h1>
          <p>Quiz by {results.teacherName}</p>
          <button className="btn-exit-quiz" onClick={exitQuiz}>
            ✕ Back to Teachers
          </button>
        </div>
        <div className="results-content-fullscreen">
          <div className="score-display">
            <div className="score-number">{results.score}</div>
            <div className="score-text">
              out of {results.totalQuestions} correct
            </div>
            <div className="score-percentage">{results.percentage}%</div>
          </div>
          <div className="results-details">
            <h3>Detailed Results</h3>
            {results.questionResults.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  background: "white",
                  borderRadius: "10px",
                  border: `2px solid ${
                    result.isCorrect ? "#28a745" : "#dc3545"
                  }`,
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    marginBottom: 10,
                    color: "#2c3e50",
                  }}
                >
                  Question {index + 1}: {result.question}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <span style={{ color: "#6c757d" }}>
                    Your Answer: <strong>{result.userAnswer}</strong>
                  </span>
                  <span
                    style={{
                      color: result.isCorrect ? "#28a745" : "#dc3545",
                      fontWeight: 600,
                    }}
                  >
                    {result.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                {!result.isCorrect && (
                  <p
                    style={{
                      marginTop: 8,
                      color: "#28a745",
                      fontSize: "0.9rem",
                    }}
                  >
                    Correct Answer: <strong>{result.correctAnswer}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowResults(false);
                resetQuiz();
              }}
            >
              🔄 Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default view with sidebar and teacher selection
  return (
    <div className="student-page">
      <div className="sidebar">
        <h2>Teachers</h2>
        {loadingTeachers && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading teachers...</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <ul className="teacher-list">
          {!loadingTeachers && teachers.length === 0 ? (
            <p>No teachers found.</p>
          ) : (
            teachers.map((teacher) => (
              <li
                key={teacher._id}
                className={`teacher-item ${
                  selectedTeacher?._id === teacher._id ? "selected" : ""
                }`}
                onClick={() => handleSelectTeacher(teacher)}
              >
                {teacher.email}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="main-content">
        {selectedTeacher ? (
          <div className="quiz-container">
            <div className="quiz-header">
              <h1>Quiz by {selectedTeacher.email}</h1>
              <p>Test your knowledge with these questions</p>
              {loadingQuestions ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="empty-message">
                  <div className="empty-message-icon">📝</div>
                  <h3>No Questions Available</h3>
                  <p>This teacher hasn't added any questions yet.</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", marginTop: 30 }}>
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: 15,
                      padding: 25,
                      marginBottom: 30,
                    }}
                  >
                    <h3 style={{ color: "#2c3e50", marginBottom: 15 }}>
                      Quiz Information
                    </h3>
                    <p style={{ color: "#6c757d", marginBottom: 10 }}>
                      <strong>Total Questions:</strong> {questions.length}
                    </p>
                    {/* <p style={{ color: "#6c757d" }}>
                      <strong>Time:</strong> No time limit
                    </p> */}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={startQuiz}
                    style={{ fontSize: "1.2rem", padding: "15px 40px" }}
                  >
                    Start Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: 20 }}>👨‍🏫</div>
            <h2
              style={{ color: "black", marginBottom: 15, fontSize: "2.4rem" }}
            >
              Select a Teacher
            </h2>
            <p style={{ fontSize: "1.2rem", opacity: 0.7 }}>
              Choose a teacher from the sidebar to start taking their quiz
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
