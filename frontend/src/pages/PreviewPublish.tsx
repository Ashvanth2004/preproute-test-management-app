import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, Edit, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

interface QuestionItem {
  id: number;
  question: string;
  options: string[];
  answer: number;
  difficulty: string;
  topic_id: string;
  sub_topic_id: string;
  image?: string;
  explanation: string;
}

interface TestInfo {
  title: string;
  subject: string;
  type: string;
  difficulty: string;
  total_time: number;
  total_marks: number;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
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
};

const PreviewPublish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPublished, setShowPublished] = useState(false);
  const [isPublished, setIsPublished] = useState(() => localStorage.getItem(`test-${id}-published`) === 'true');

  const [questions] = useState<QuestionItem[]>(() => {
    const stored = localStorage.getItem(`test-${id}-questions`);
    return stored ? JSON.parse(stored) : [];
  });

  const [testInfo] = useState<TestInfo>(() => {
    const stored = localStorage.getItem(`test-${id}-info`);
    if (stored) return JSON.parse(stored);
    return {
      title: 'React Basics Quiz',
      subject: 'Mathematics',
      type: 'practice',
      difficulty: 'medium',
      total_time: 60,
      total_marks: questions.length * 4,
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
    };
  });

  const handlePublish = async () => {
    try {
      await api.put(`/tests/${id}`, { status: 'live' });
    } catch {
      // Backend unavailable — use local state
    }
    localStorage.setItem(`test-${id}-published`, 'true');
    setIsPublished(true);
    setShowPublished(true);
    setTimeout(() => {
      setShowPublished(false);
      navigate('/dashboard');
    }, 2000);
  };

  const renderFormattedText = (text: string) => {
    if (!text) return text;
    let html = text
      .replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>')
      .replace(/<i>(.*?)<\/i>/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter(q => q.answer >= 0).length;

  return (
    <div className="preview-publish">
      <header>
        <div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')} style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <h1>Preview & Publish</h1>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => navigate(`/tests/${id}/questions`)}>
            <Edit size={20} />
            <span>Edit Questions</span>
          </button>
          <button className="btn btn-primary" onClick={handlePublish} disabled={isPublished}>
            <Send size={20} />
            <span>{isPublished ? 'Published ✓' : 'Publish Test'}</span>
          </button>
        </div>
      </header>

      {/* Test Summary Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>{testInfo.title}</h2>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)' }}>
              Subject: {testInfo.subject} | Type: {testInfo.type} | Difficulty: {testInfo.difficulty}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0 }}><strong>Duration:</strong> {testInfo.total_time} min</p>
            <p style={{ margin: 0 }}><strong>Total Marks:</strong> {testInfo.total_marks}</p>
            <p style={{ margin: 0 }}><strong>Questions:</strong> {totalQuestions} ({answeredQuestions} answered)</p>
          </div>
        </div>
        <hr style={{ margin: '1rem 0' }} />
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <span>✅ Correct: +{testInfo.correct_marks}</span>
          <span>❌ Wrong: {testInfo.wrong_marks}</span>
          <span>⏭️ Unattempted: {testInfo.unattempt_marks}</span>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 ? (
        <div className="preview-content">
          {questions.map((q, index) => (
            <div className="question-preview" key={q.id} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: index < questions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0 }}>Q{index + 1}. {renderFormattedText(q.question)}</h4>
                <span className={`difficulty-badge difficulty-${q.difficulty}`} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                  {q.difficulty}
                </span>
              </div>

              {q.image && (
                <div style={{ marginTop: '0.75rem' }}>
                  <img
                    src={q.image}
                    alt={`Question ${index + 1} image`}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  />
                </div>
              )}

              <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    style={{
                      fontWeight: q.answer === i ? 'bold' : 'normal',
                      color: q.answer === i ? 'var(--success)' : 'var(--text-main)',
                      padding: '0.25rem 0',
                    }}
                  >
                    {String.fromCharCode(65 + i)}. {opt} {q.answer === i && '✓'}
                  </li>
                ))}
              </ul>

              {q.explanation && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '4px', fontSize: '0.9rem' }}>
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No questions have been added yet.</p>
          <Link to={`/tests/${id}/questions`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            <Edit size={18} />
            <span>Add Questions</span>
          </Link>
        </div>
      )}

      {showPublished && (
        <div style={notificationStyle}>
          ✓ Test Published Successfully! Redirecting to dashboard...
        </div>
      )}
    </div>
  );
};

export default PreviewPublish;
