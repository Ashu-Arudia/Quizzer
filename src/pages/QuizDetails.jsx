import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import edit from "../icons/edit.png";
import nothing from "../icons/nothing.png";

export default function QuizDetailsEditable() {
  const { Id } = useParams();
  const [quizTitle, setQuizTitle] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingQuizTitle, setEditingQuizTitle] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://quizzer-jqif.onrender.com/api/quizzes/${Id}/questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setQuizTitle(data.title);
        setNewQuizTitle(data.title);
        setQuestions(data.questions);
      } catch (err) {
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Id]);

  const handleDeleteQuestion = async (questionId) => {
    const confirmed = window.confirm("Delete this question?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://quizzer-jqif.onrender.com/api/quizzes/question/${questionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete");

      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    } catch (err) {
      alert("Error deleting question: " + err.message);
    }
  };

  const handleEditQuestion = async (questionId, updated) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://quizzer-jqif.onrender.com/api/quizzes/question/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updated),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      setQuestions((prev) =>
        prev.map((q) => (q._id === questionId ? { ...q, ...updated } : q))
      );
    } catch (err) {
      alert("Error updating question");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "30px",
          }}
        >
          {quizTitle}
        </div>
        <div>
          <QuizDetailsEdit />{" "}
        </div>
      </div>
      {questions.length === 0 ? (
        <div style={{ minHeight: "70vh" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                maxWidth: "25px",
                zIndex: "10",
              }}
            >
              {/* <button style={{ border: "none", backgroundColor: "white" }}>
                <img
                  src={add}
                  alt="add"
                  style={{ width: "100%", height: "100%" }}
                />
              </button> */}
            </div>
            <div
              style={{
                display: "flex",
                color: "red",
                justifyContent: "center",
                marginTop: "150px",
                fontSize: "30px",
                marginRight: "25px",
                opacity: "0.8",
              }}
            >
              <img src={nothing} alt="nothing" />
              <div>No Questions Yet!</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: "70vh" }}>
          <div style={{ padding: "10px", maxWidth: "1100px", margin: "auto" }}>
            {error && <div style={{ color: "red" }}>{error}</div>}

            {questions.map((q, index) => (
              <div
                key={q._id}
                style={{
                  position: "relative",
                  background: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                }}
              >
                <QuestionCard
                  question={q}
                  index={index}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function QuizDetailsEdit() {
  const { Id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  // Fetch quiz when button clicked
  const openEditModal = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://quizzer-jqif.onrender.com/api/quizzes/${Id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setQuizData(data);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch quiz");
    } finally {
      setLoading(false);
    }
  };

  // Save edited quiz
  const saveQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://quizzer-jqif.onrender.com/api/quizzes/${Id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      setShowModal(false);
      window.location.reload();
    } catch {
      alert("Could not save changes");
    }
  };

  if (loading && !quizData) return <div>Loading...</div>;

  return (
    <>
      <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button
          onClick={openEditModal}
          style={{
            maxWidth: "20px",
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          <img
            src={edit}
            alt="edit"
            style={{
              backgroundColor: "white",
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </button>

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "8px",
                width: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              {/* <h3>Edit Quiz Info</h3> */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>Name:</label>
                <input
                  type="text"
                  value={quizData.name}
                  onChange={(e) =>
                    setQuizData({ ...quizData, name: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>Level:</label>
                <select
                  value={quizData.level}
                  onChange={(e) =>
                    setQuizData({ ...quizData, level: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>Time Limit (mins):</label>
                <input
                  type="number"
                  value={quizData.timeLimit}
                  onChange={(e) =>
                    setQuizData({ ...quizData, timeLimit: +e.target.value })
                  }
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>Visibility:</label>
                <select
                  value={quizData.visibility}
                  onChange={(e) =>
                    setQuizData({ ...quizData, visibility: e.target.value })
                  }
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>

              {quizData.visibility === "Private" && (
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ fontWeight: "bold" }}>Password:</label>
                  <input
                    type="text"
                    value={quizData.password || ""}
                    onChange={(e) =>
                      setQuizData({ ...quizData, password: e.target.value })
                    }
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>
                  Topics (comma‑separated):
                </label>
                <input
                  type="text"
                  value={quizData.topics.join(",")}
                  onChange={(e) =>
                    setQuizData({
                      ...quizData,
                      topics: e.target.value.split(",").map((t) => t.trim()),
                    })
                  }
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  onClick={saveQuiz}
                  style={{
                    padding: "10px 20px",
                    background: "black",
                    color: "#fff",
                    marginRight: "10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#aaa",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function QuestionCard({ question, index, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [options, setOptions] = useState([...question.options]);
  const [correct, setCorrect] = useState([...question.correct]);
  const menuRef = useRef();

  const toggleCorrect = (idx) => {
    setCorrect((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSave = () => {
    onEdit(question._id, { text, options, correct });
    setIsEditing(false);
    setShowMenu(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h4 style={{ margin: 0 }}>
          {index + 1}:{" "}
          {isEditing ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ width: "70%", padding: "5px" }}
            />
          ) : (
            question.text
          )}
        </h4>
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: "none",
              border: "none",
              fontWeight: "bold",
              fontSize: "25px",
              cursor: "pointer",
              padding: "0 10px",
              transition: "color 0.2s",
              color: showMenu ? "#222" : "#777",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#000")}
            onMouseLeave={(e) =>
              (e.target.style.color = showMenu ? "#222" : "#777")
            }
          >
            ⋯
          </button>

          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: "25px",
                right: "0",
                background: "#fff",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                borderRadius: "5px",
                zIndex: 2,
                minWidth: "120px",
                overflow: "hidden",
              }}
            >
              <div
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                Edit
              </div>
              <div
                onClick={() => {
                  onDelete(question._id);
                  setShowMenu(false);
                }}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  color: "red",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "10px" }}>
        {options.map((opt, i) => (
          <li key={i} style={{ marginBottom: "8px" }}>
            {isEditing ? (
              <>
                <input
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[i] = e.target.value;
                    setOptions(newOpts);
                  }}
                  style={{ padding: "6px", width: "60%" }}
                />
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="checkbox"
                    checked={correct.includes(i)}
                    onChange={() => toggleCorrect(i)}
                  />{" "}
                  Correct
                </label>
              </>
            ) : (
              <>
                {i + 1}. {opt}
                {correct.includes(i) && (
                  <span style={{ color: "green", marginLeft: "10px" }}>✓</span>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {isEditing && (
        <>
          <button
            onClick={handleSave}
            style={{
              padding: "6px 12px",
              marginRight: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#aaa",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Cancel
          </button>
        </>
      )}
    </>
  );
}
