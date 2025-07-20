import { useEffect, useState } from "react";
import "./StudentPage.css";

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingTeachers(true);
      setError("");
      try {
        console.log("Fetching teachers from:", "http://localhost:8000/api/user/teachers");
        const res = await fetch("http://localhost:8000/api/user/teachers");
        console.log("Response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Teachers data received:", data);
        setTeachers(data.teachers || []);
      } catch (err) {
        console.error("Failed to load teachers", err);
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
      return;
    }

    setSelectedTeacher(teacher);
    setLoadingQuestions(true);

    try {
      console.log("Fetching MCQs for teacher:", teacher._id);
      const res = await fetch(`http://localhost:8000/api/mcq/${teacher._id}`);
      console.log("MCQ response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("MCQ data received:", data);
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      console.error("Failed to load questions", err);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="student-page">
      <div className="sidebar">
        <h2>Teachers</h2>

        {loadingTeachers && (
          <div className="loading">
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
          <div className="questions-container">
            <h2>Questions by {selectedTeacher.email}</h2>
            {loadingQuestions ? (
              <p className="loader">Loading questions…</p>
            ) : questions.length === 0 ? (
              <p className="empty-message">No questions available.</p>
            ) : (
              <div className="questions-scroll">
                {questions.map((q) => (
                  <div key={q._id} className="question-card">
                    <p className="question-text">{q.question}</p>
                    <ul className="mcq-options">
                      {q.options.map((opt, idx) => (
                        <li key={idx}>{opt}</li>
                      ))}
                    </ul>
                    <p className="mcq-correct">
                      Correct Answer:{" "}
                      <strong>{q.correctAnswer || "N/A"}</strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="select-message">
            Please select a teacher to view questions.
          </p>
        )}
      </div>
    </div>
  );
}
