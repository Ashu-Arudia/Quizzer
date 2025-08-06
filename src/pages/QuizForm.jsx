import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "./QuizForm.module.css";

const QuizForm = () => {
  const [step, setStep] = useState(1);
  const [quizName, setQuizName] = useState("");
  const [timeLimit, setTimeLimit] = useState(1);
  const [level, setLevel] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correct: [],
  });
  const Navigate = useNavigate();

  // State for validation errors
  const [quizNameError, setQuizNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [questionError, setQuestionError] = useState("");

  const handleTopicAdd = () => {
    if (topicInput && !topics.includes(topicInput)) {
      setTopics([...topics, topicInput]);
      setTopicInput("");
    }
  };

  const handleNext = () => {
    let isValid = true;
    setQuizNameError("");
    setPasswordError("");

    if (!quizName.trim()) {
      setQuizNameError("Quiz Name is required.");
      isValid = false;
    }

    if (isPrivate && !password.trim()) {
      setPasswordError("Access Password is required for private quizzes.");
      isValid = false;
    }

    if (isValid) {
      setStep(2);
    }
  };

  const handleAddQuestion = () => {
    setQuestionError("");
    if (!currentQuestion.text.trim()) {
      setQuestionError("Please enter a question text.");
      return;
    }
    const hasEmptyOption = currentQuestion.options.some((opt) => !opt.trim());
    if (hasEmptyOption) {
      setQuestionError("Please fill in all four options.");
      return;
    }
    if (currentQuestion.correct.length === 0) {
      setQuestionError("Please select at least one correct answer.");
      return;
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ text: "", options: ["", "", "", ""], correct: [] });
  };

  const handleQuestionOptionChange = (idx, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[idx] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const toggleCorrectOption = (idx) => {
    const correct = [...currentQuestion.correct];
    if (correct.includes(idx)) {
      setCurrentQuestion({
        ...currentQuestion,
        correct: correct.filter((i) => i !== idx),
      });
    } else {
      setCurrentQuestion({ ...currentQuestion, correct: [...correct, idx] });
    }
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const token = localStorage.getItem("token");
  const handleSubmit = async () => {
    try {
      // Step 1: Create the Quiz document (meta-data only)
      const quizData = {
        name: quizName,
        level,
        timeLimit,
        visibility: isPrivate ? "Private" : "Public",
        password: isPrivate ? password : null,
        topics,
      };

      const quizResponse = await fetch(
        "https://quizzer-jqif.onrender.com/api/quizzes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(quizData),
        }
      );

      if (!quizResponse.ok) {
        throw new Error("Failed to create quiz.");
      }
      const createdQuiz = await quizResponse.json();
      const quizId = createdQuiz._id;
      console.log(quizId);
      console.log("Step 2: Preparing questions with the new quiz ID...");
      // Map over the questions array to add the newly created quiz ID
      const questionsPayload = questions.map((q) => ({
        ...q,
        quiz: quizId, // Add the quiz ID to each question object
      }));

      console.log(
        "Sending questions payload to the bulk endpoint:",
        questionsPayload
      );

      // Step 3: Send all questions to the backend using the new BULK route.
      // THIS IS THE CRUCIAL CHANGE: The URL now includes "/bulk"
      const questionResponse = await fetch(
        "https://quizzer-jqif.onrender.com/api/quizzes/questions/bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: questionsPayload }),
        }
      );

      if (!questionResponse.ok) {
        const errorData = await questionResponse.json();
        console.error("Backend error response:", errorData);
        throw new Error(
          `HTTP error! Status: ${questionResponse.status}. Could not create questions.`
        );
      }

      const createdQuestions = await questionResponse.json();
      console.log("Questions created successfully:", createdQuestions);

      alert("Quiz and questions saved successfully!");
      Navigate("/teacher0");
    } catch (err) {
      console.error("An error occurred during the quiz creation process:", err);
      alert(
        "Failed to save quiz and questions. Please check the browser console and server terminal for details."
      );
    }
  };
  return (
    <>
      <Header />
      <div className={styles.quizFormContainer}>
        <div className={styles.stepIndicator}>
          <span className={step === 1 ? styles.active : ""}>Step 1</span>
          <span className={step === 2 ? styles.active : ""}>Step 2</span>
        </div>
        {step === 1 ? (
          <div className={styles.formSection}>
            <h2>Quiz Details</h2>

            <div className={styles.formGroup}>
              <label htmlFor="quizName">
                Quiz Name
                <span className={styles.required}>*</span>
              </label>
              <input
                id="quizName"
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className={`${styles.input} ${
                  quizNameError ? styles.inputError : ""
                }`}
              />
              {quizNameError && (
                <p className={styles.errorText}>{quizNameError}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="difficultyLevel">Difficulty Level</label>
              <select
                id="difficultyLevel"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={styles.input}
              >
                <option value="">Select level</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timeLimit">Time Limit (in minutes)</label>
              <input
                id="timeLimit"
                type="number"
                min={1}
                max={180}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                value={isPrivate ? "Private" : "Public"}
                onChange={(e) => setIsPrivate(e.target.value === "Private")}
                className={styles.input}
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </div>

            {isPrivate && (
              <div className={styles.formGroup}>
                <label htmlFor="accessPassword">
                  Access Password
                  <span className={styles.required}>*</span>
                </label>
                <input
                  id="accessPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${styles.input} ${
                    passwordError ? styles.inputError : ""
                  }`}
                />
                {passwordError && (
                  <p className={styles.errorText}>{passwordError}</p>
                )}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="topicInput">Add Topics</label>
              <div className={styles.topicInputContainer}>
                <input
                  id="topicInput"
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder=""
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTopicAdd();
                    }
                  }}
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={handleTopicAdd}
                  className={styles.addButton}
                >
                  Add
                </button>
              </div>
              <div className={styles.topicTags}>
                {topics.map((topic, index) => (
                  <span key={index} className={styles.topicTag}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className={styles.nextButton}
            >
              Next
            </button>
          </div>
        ) : (
          <div className={styles.formSection}>
            <h2>Add Questions</h2>

            <div className={styles.currentQuestionCard}>
              <h3>Add a New Question</h3>
              <div className={styles.formGroup}>
                <label htmlFor="questionText">Question</label>
                <textarea
                  id="questionText"
                  rows="3"
                  value={currentQuestion.text}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      text: e.target.value,
                    })
                  }
                  className={styles.textarea}
                  placeholder="Enter the question..."
                />
              </div>

              <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option, i) => (
                  <div key={i} className={styles.optionInputGroup}>
                    <input
                      type="text"
                      value={option}
                      placeholder={`Option ${i + 1}`}
                      onChange={(e) =>
                        handleQuestionOptionChange(i, e.target.value)
                      }
                      className={styles.input}
                    />
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={currentQuestion.correct.includes(i)}
                        onChange={() => toggleCorrectOption(i)}
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>

              {questionError && (
                <p className={styles.errorText}>{questionError}</p>
              )}

              <button
                type="button"
                onClick={handleAddQuestion}
                className={styles.addQuestionButton}
              >
                Add Question
              </button>
            </div>

            <div className={styles.questionsList}>
              <h3>Questions Added ({questions.length})</h3>
              {questions.map((q, index) => (
                <div key={index} className={styles.questionPreviewCard}>
                  <div className={styles.questionText}>
                    <strong>Q{index + 1}:</strong> {q.text}
                  </div>
                  <ul className={styles.optionsList}>
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={
                          q.correct.includes(i) ? styles.correctOption : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.formNavigation}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className={styles.backButton}
              >
                ← Back
              </button>
              <button onClick={handleSubmit} className={styles.submitButton}>
                Submit Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizForm;
