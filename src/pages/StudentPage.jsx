import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Password from "../icons/password.png";
import Teacher from "../icons/teacher.png";
import "./StudentPage.css";

function QuizPasswordModal({ isOpen, onClose, onPasswordSubmit, error }) {
  const [password, setPassword] = useState("");
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(password);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Password to Access this Quiz</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <div className="modal-buttons">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [error, setError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedQuizForPassword, setSelectedQuizForPassword] = useState(null);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

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

  const handleQuizCardClick = (quiz) => {
    if (quiz.visibility === "Private") {
      setSelectedQuizForPassword(quiz);
      setShowPasswordModal(true);
      setPasswordError("");
    } else {
      navigate(`/student/quiz/${quiz._id}`);
    }
  };

  const handleSubmitPassword = async (password) => {
    setPasswordError("");
    try {
      const res = await fetch(
        `http://localhost:8000/api/quizzes/${selectedQuizForPassword._id}/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Invalid password");
      }
      setShowPasswordModal(false);
      navigate(`/student/quiz/${selectedQuizForPassword._id}`);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

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
          {selectedTeacher ? (
            <div className="quiz-list-container">
              <div className="quiz-list-header">
                <h1 style={{ marginBottom: "20px" }}>
                  Quizzes by {selectedTeacher.username}
                </h1>
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
                      onClick={() => handleQuizCardClick(quiz)}
                    >
                      <div className="quiz-card-details">
                        <div className="quiz-card-header">
                          <h3>{quiz.name}</h3>

                          {quiz.visibility === "Private" && (
                            <img
                              src={Password}
                              alt="lock"
                              style={{
                                objectFit: "contain",
                                width: "16px",
                                height: "16px",
                              }}
                            />
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
                      <button className="btn-start">Start Quiz →</button>
                    </li>
                  ))}
                </ul>
              )}
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
          )}
        </div>
      </div>
      <QuizPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordSubmit={handleSubmitPassword}
        error={passwordError}
      />
    </>
  );
}
