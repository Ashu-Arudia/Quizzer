import { useEffect, useState } from "react";
import MCQForm from "../components/MCQForm";
import "./AdminPage.css";

export default function AdminPage() {
  const [mcqs, setMcqs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    console.log("useEffect started");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("Token from localStorage:", token);
    console.log("Role from localStorage:", role);

    if (!token) {
      console.warn("No token found; setting error");
      setError("You must be logged in to view your MCQs.");
      setLoading(false);
      return;
    }

    if (role !== "teacher") {
      console.warn("User is not a teacher; setting error");
      setError(
        `Access denied: You are logged in as a ${role}, but only teachers can view MCQs.`
      );
      setLoading(false);
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
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers);

        if (!res.ok) {
          return res.json().then((errorData) => {
            console.error("Server error response:", errorData);
            throw new Error(errorData.error || "Failed to fetch MCQs");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("MCQs data received:", data);
        setMcqs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteMCQ = async (mcqId) => {
    if (!window.confirm("Are you sure you want to delete this MCQ?")) {
      return;
    }

    const token = localStorage.getItem("token");
    setDeleteError(""); // Clear any previous errors

    try {
      const response = await fetch(`http://localhost:8000/api/mcq/${mcqId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMcqs(mcqs.filter((mcq) => mcq._id !== mcqId));
        // Show success message briefly
        setEditMessage("MCQ deleted successfully!");
        setTimeout(() => setEditMessage(""), 3000);
      } else {
        const errorData = await response.json();
        setDeleteError(errorData.error || "Failed to delete MCQ");
        setTimeout(() => setDeleteError(""), 5000);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError("Failed to delete MCQ. Please try again.");
      setTimeout(() => setDeleteError(""), 5000);
    }
  };

  const handleEditClick = () => {
    setEditMessage("Edit functionality coming soon! Stay tuned for updates.");
    setTimeout(() => setEditMessage(""), 4000);
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>MCQ Management Portal</h1>
          <p>Create, manage, and organize your multiple choice questions</p>
        </div>

        <div className="admin-body">
          {/* MCQ Form Section */}
          <div className="mcq-form-section">
            <h2 className="section-title">Add New MCQ</h2>
            <MCQForm onMCQAdded={(newMCQ) => setMcqs([...mcqs, newMCQ])} />
          </div>

          {/* MCQ List Section */}
          <div className="mcq-list-section">
            <h2 className="section-title">Your MCQs</h2>

            {error && (
              <div className="message message-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {deleteError && (
              <div className="message message-error">
                <span>❌</span>
                {deleteError}
              </div>
            )}

            {editMessage && (
              <div className="message message-info">
                <span>ℹ️</span>
                {editMessage}
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading your MCQs...</p>
              </div>
            )}

            {!loading && mcqs.length === 0 && !error && (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>No MCQs Yet</h3>
                <p>
                  Start by adding your first multiple choice question above!
                </p>
              </div>
            )}

            {!loading && mcqs.length > 0 && (
              <div className="mcq-grid">
                {mcqs.map((mcq, index) => (
                  <div key={mcq._id || index} className="mcq-card">
                    <div className="mcq-question">{mcq.question}</div>

                    <ul className="mcq-options">
                      {mcq.options.map((option, idx) => (
                        <li
                          key={idx}
                          className={
                            option === mcq.correctAnswer ? "mcq-correct" : ""
                          }
                        >
                          {option}
                        </li>
                      ))}
                    </ul>

                    <div className="mcq-actions">
                      <button
                        className="btn btn-edit"
                        onClick={handleEditClick}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteMCQ(mcq._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
