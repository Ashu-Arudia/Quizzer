import { useEffect, useState } from "react";
import "./StudentPage.css";

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/teachers");
        const data = await res.json();
        setTeachers(data.teachers || []);
      } catch (err) {
        console.error("Failed to load teachers", err);
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
      const res = await fetch(`http://localhost:8000/api/mcq/${teacher._id}`);
      const data = await res.json();
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
        <ul className="teacher-list">
          {teachers.length === 0 ? (
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
