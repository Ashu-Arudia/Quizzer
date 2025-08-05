import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Teacher from "../icons/teacher.png";
import "./StudentPage.css";

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [error, setError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const existingToken = localStorage.getItem("token");

    if (tokenFromUrl) {
      const role = params.get("role");
      localStorage.setItem("role", role);
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = tokenFromUrl || existingToken;

    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const token = localStorage.getItem("token");

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
      setQuizzes([]);
      return;
    }

    setSelectedTeacher(teacher);
    setLoadingQuizzes(true);
    setQuizzes([]);
    try {
      const res = await fetch(`http://localhost:8000/api/user/${teacher._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
    } catch (err) {
      setQuizzes([]);
      setError("Failed to load quizzes for this teacher.");
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleSelectQuiz = async (quizId) => {
    setLoadingQuestions(true);
    setError("");
    resetQuiz();
    try {
      const res = await fetch(
        `http://localhost:8000/api/user/${quizId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
      if (data.questions && data.questions.length > 0) {
        setQuizStarted(true);
      }
    } catch (err) {
      setQuestions([]);
      setError("Failed to load quiz questions. Please try again.");
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
    setQuestions([]);
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
    let correctAnswers = 0;
    const questionResults = questions.map((question) => {
      const userAnswer = selectedAnswers[question._id];
      const isCorrect = userAnswer === question.correct;
      if (isCorrect) correctAnswers++;
      return {
        question: question.text,
        userAnswer,
        correctAnswer: question.correct,
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
      teacherName: selectedTeacher.username,
    };
    setResults(quizResults);
    setQuizCompleted(true);
    setShowResults(true);
  };

  const exitQuiz = () => {
    resetQuiz();
    setSelectedTeacher(null);
    setQuizzes([]);
    setQuestions([]);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(selectedAnswers).length;

  if (quizStarted && !showResults) {
    return (
      <div className="quiz-fullscreen">
        <div className="quiz-header-fullscreen">
          <div className="quiz-info">
            <h1>
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            <p>Quiz by {selectedTeacher.username}</p>
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
            <p className="question-text">{currentQuestion.text}</p>
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

  return (
    <>
      <Header />
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
                  {teacher.username}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="main-content">
          {selectedTeacher && !quizStarted ? (
            <div className="quiz-list-container">
              <div className="quiz-list-header">
                <h1>Quizzes by {selectedTeacher.username}</h1>
                <p>Select a quiz to start</p>
              </div>
              {loadingQuizzes ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="empty-message">
                  <div className="empty-message-icon">📝</div>
                  <h3>No Quizzes Available</h3>
                  <p>This teacher hasn't created any quizzes yet.</p>
                </div>
              ) : (
                <ul className="quizzes-list">
                  {quizzes.map((quiz) => (
                    <li
                      key={quiz._id}
                      className="quiz-item"
                      onClick={() => handleSelectQuiz(quiz._id)}
                    >
                      <div className="quiz-card-details">
                        <div className="quiz-card-header">
                          <h3>{quiz.name}</h3>
                          {quiz.visibility && (
                            <span
                              className={`quiz-visibility ${quiz.visibility.toLowerCase()}`}
                            >
                              {quiz.visibility}
                            </span>
                          )}
                        </div>
                        <div className="quiz-card-meta">
                          <p>
                            <span>Difficulty:</span> {quiz.level}
                          </p>
                          <p>
                            <span>Questions:</span> {quiz.questionCount}
                          </p>
                          <p>
                            <span>Time Limit:</span> {quiz.timeLimit} min
                          </p>
                        </div>
                      </div>
                      <button className="btn-start">Start Test →</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : !selectedTeacher ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "black",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  fontSize: "4rem",
                  marginBottom: 20,
                  width: "80px",
                  height: "240px",
                  marginLeft: "32vw",
                }}
              >
                <img
                  src={Teacher}
                  alt="teacher"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              <h2
                style={{ color: "black", marginBottom: 15, fontSize: "2.4rem" }}
              >
                Select a Teacher
              </h2>
              <p style={{ fontSize: "1.2rem", opacity: 0.7 }}>
                Choose a teacher from the sidebar to view their quizzes
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
