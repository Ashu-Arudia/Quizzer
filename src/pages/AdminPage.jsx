import './AdminPage.css';
import MCQForm from '../components/MCQForm';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [mcqs, setMcqs] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('mcqs')) || [];
    setMcqs(data);
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <MCQForm />

      <hr />
      <h3>Stored MCQs:</h3>
      {mcqs.length === 0 ? (
        <p>No MCQs added yet.</p>
      ) : (
        <ul>
          {mcqs.map((q, index) => (
            <li key={index}>
              <strong>{q.question}</strong>
              <ul>
                {q.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <p><em>Correct: {q.correctAnswer}</em></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
