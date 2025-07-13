// src/components/MCQForm.jsx
import { useState } from 'react';

export default function MCQForm() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✨ Validation
    if (!question.trim()) {
      return setError('Question cannot be empty.');
    }
    if (options.some(opt => !opt.trim())) {
      return setError('All options must be filled.');
    }
    if (new Set(options).size !== options.length) {
      return setError('Options must be unique.');
    }
    if (!options.includes(correctAnswer)) {
      return setError('Correct answer must match one of the options.');
    }

    const mcq = { question, options, correctAnswer };
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('mcqs')) || [];
    localStorage.setItem('mcqs', JSON.stringify([...existing, mcq]));

    console.log('MCQ Submitted:', mcq);
    alert('MCQ Added!');

    // Reset form
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New MCQ</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Enter question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      /><br /><br />

      {options.map((opt, idx) => (
        <div key={idx}>
          <input
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          /><br /><br />
        </div>
      ))}

      <input
        type="text"
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        required
      /><br /><br />

      <button type="submit">Submit</button>
    </form>
  );
}
