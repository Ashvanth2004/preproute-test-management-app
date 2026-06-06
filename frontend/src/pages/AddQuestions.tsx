import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number; // index of the correct option
}

const AddQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock state for questions
  const [questions, setQuestions] = React.useState<Question[]>([
    { id: 1, text: 'What is React?', options: ['A library', 'A framework', 'A language', 'A database'], answer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', options: ['', '', '', ''], answer: -1 },
    ]);
  };

  const deleteQuestion = (questionId: number) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
  };

  const handleQuestionTextChange = (questionId: number, newText: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, text: newText } : q
      )
    );
  };

  const handleOptionTextChange = (questionId: number, optionIndex: number, newText: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optionIndex ? newText : opt
              ),
            }
          : q
      )
    );
  };

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, answer: optionIndex } : q
      )
    );
  };

  const handleSaveAndPreview = () => {
    localStorage.setItem(`test-${id}-questions`, JSON.stringify(questions));
    navigate(`/tests/${id}/preview`);
  };

  return (
    <div className="add-questions">
      <header>
        <h1>Add Questions to Test (ID: {id})</h1>
        <div className="header-actions">
          <button onClick={addQuestion} className="btn">
            <Plus size={20} />
            <span>Add Question</span>
          </button>
          <button className="btn btn-primary" onClick={handleSaveAndPreview}>
            <Save size={20} />
            <span>Save and Preview</span>
          </button>
        </div>
      </header>
      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <div className="question-header">
              <h3>Question {index + 1}</h3>
              <button onClick={() => deleteQuestion(q.id)} title="Delete" className="btn-icon">
                <Trash2 size={18} />
              </button>
            </div>
            <textarea
              placeholder="Enter your question..."
              value={q.text}
              onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
            />
            <div className="options">
              {q.options.map((optionText, i) => (
                <div key={i} className="option-item">
                  <input
                    type="radio"
                    name={`q${q.id}-answer`}
                    id={`q${q.id}-opt${i}`}
                    checked={q.answer === i}
                    onChange={() => handleAnswerChange(q.id, i)}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={optionText}
                    onChange={(e) => handleOptionTextChange(q.id, i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddQuestions;