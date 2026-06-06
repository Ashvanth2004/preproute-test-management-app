import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Edit } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  answer: number;
}

const notificationStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#10b981',
  color: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '8px',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 9999,
  transition: 'opacity 0.3s ease',
};

const PreviewPublish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPublished, setShowPublished] = useState(false);
  const [isPublished, setIsPublished] = useState(() => localStorage.getItem(`test-${id}-published`) === 'true');
  const [questions] = React.useState<Question[]>(() => {
    const storedQuestions = localStorage.getItem(`test-${id}-questions`);
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const [testDetails] = React.useState({ title: 'React Basics Quiz (Preview)', duration: '30' });

  const handlePublish = () => {
    localStorage.setItem(`test-${id}-published`, 'true');
    setIsPublished(true);
    setShowPublished(true);
    setTimeout(() => setShowPublished(false), 3000);
  };

  return (
    <div className="preview-publish">
      <header>
        <h1>Preview & Publish (Test ID: {id})</h1>
        <div className="header-actions">
          <button className="btn" onClick={() => navigate(`/tests/${id}/questions`)}>
            <Edit size={20} />
            <span>Edit</span>
          </button>
          <button className="btn btn-primary" onClick={handlePublish} disabled={isPublished}>
            <Send size={20} />
            <span>{isPublished ? 'Published' : 'Publish Test'}</span>
          </button>
        </div>
      </header>
      <div className="preview-content">
        <h2>{testDetails.title}</h2>
        <p><strong>Duration:</strong> {testDetails.duration} minutes</p>
        <hr />
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div className="question-preview" key={q.id}>
              <h4>{index + 1}. {q.text}</h4>
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i} style={{ fontWeight: q.answer === i ? 'bold' : 'normal' }}>
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No questions have been added yet.</p>
        )}
      </div>

      {showPublished && (
        <div style={notificationStyle}>
          ✓ Test Published Successfully!
        </div>
      )}
    </div>
  );
};

export default PreviewPublish;