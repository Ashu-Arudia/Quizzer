import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function AdminPage0() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

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
      fetchQuizzes(token);
    }
  }, [navigate]);

  const fetchQuizzes = async (token) => {
    try {
      const response = await fetch(
        "https://quizzer-jqif.onrender.com/api/quizzes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      const data = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    navigate("/teacher/quizform");
  };

  const handleDeleteQuiz = async (quizId, event) => {
    event.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://quizzer-jqif.onrender.com/api/quizzes/${quizId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete quiz");

      setQuizzes((prev) => prev.filter((q) => q._id !== quizId));
    } catch (err) {
      alert("Error deleting quiz: " + err.message);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading dashboard...
      </div>
    );

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          padding: "30px 20px",
          boxSizing: "border-box",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h1 style={{ fontSize: "28px", margin: 0 }}>My Quizzes</h1>
          <button
            onClick={handleCreateQuiz}
            style={{
              padding: "10px 20px",
              backgroundColor: "rgb(254, 210, 65)",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "rgb(215, 178, 56)")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "rgb(254, 210, 65)")
            }
          >
            + Create Quiz
          </button>
        </div>

        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        )}

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {quizzes.length === 0 ? (
            <p style={{ fontSize: "16px", color: "#555" }}>
              No quizzes created yet.
            </p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                onClick={() => navigate(`/teacher/quiz/${quiz._id}`)}
                style={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #222222",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 2px 5px rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "20px",
                    color: "#000",
                  }}
                >
                  {quiz.name || quiz.title}
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#777" }}>
                  Created on: {new Date(quiz.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={(e) => handleDeleteQuiz(quiz._id, e)}
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
