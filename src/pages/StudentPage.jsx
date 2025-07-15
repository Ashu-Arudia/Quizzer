import { useEffect, useState } from "react";
import "./StudentPage.css";

export default function StudentPage() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Fetch all teachers
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

  // When a teacher is selected
  const handleSelectTeacher = async (teacher) => {
    setSelectedTeacher(teacher);
    setLoadingQuestions(true);
    try {
      const res = await fetch(`http://localhost:8000/api/mcq/${teacher._id}`);
      const data = await res.json();
      setQuestions(data.questions || data); // handle both structures
    } catch (err) {
      console.error("Failed to load questions", err);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="student-container">
      <h2>Select a Teacher to View Questions</h2>

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
              <span className="teacher-email">{teacher.email}</span>
            </li>
          ))
        )}
      </ul>

      {selectedTeacher && (
        <div className="questions-container">
          <h3>Questions by {selectedTeacher.email}</h3>
          {loadingQuestions ? (
            <p className="loader">Loading questions…</p>
          ) : questions.length === 0 ? (
            <p className="empty-message">No questions available.</p>
          ) : (
            questions.map((q) => (
              <div key={q._id} className="question-card">
                <p className="question-text">{q.question}</p>
                <ul className="mcq-options">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
                <p className="mcq-correct">
                  Correct Answer: <strong>{q.correctAnswer}</strong>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
