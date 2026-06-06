import React, { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2, Upload, FileSpreadsheet, Bold, Italic, Underline, Image, X } from 'lucide-react';
import { api } from '../services/api';

interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

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

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const AddQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState('');

  // Mock topics and sub-topics for demo
  const [topics] = useState<Topic[]>([
    { id: 'topic-1', name: 'Algebra', subject_id: 'sub-1' },
    { id: 'topic-2', name: 'Geometry', subject_id: 'sub-1' },
    { id: 'topic-3', name: 'Mechanics', subject_id: 'sub-2' },
  ]);

  const [subTopics] = useState<SubTopic[]>([
    { id: 'subtopic-1', name: 'Linear Equations', topic_id: 'topic-1' },
    { id: 'subtopic-2', name: 'Quadratic Equations', topic_id: 'topic-1' },
    { id: 'subtopic-3', name: 'Triangles', topic_id: 'topic-2' },
    { id: 'subtopic-4', name: 'Newton Laws', topic_id: 'topic-3' },
  ]);

  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 1,
      question: 'What is React?',
      options: ['A library', 'A framework', 'A language', 'A database'],
      answer: 0,
      difficulty: 'easy',
      topic_id: '',
      sub_topic_id: '',
      explanation: 'React is a JavaScript library for building user interfaces.',
    },
  ]);

  const addQuestion = () => {
    const newId = Date.now();
    setQuestions([
      ...questions,
      { id: newId, question: '', options: ['', '', '', ''], answer: -1, difficulty: 'medium', topic_id: '', sub_topic_id: '', image: '', explanation: '' },
    ]);
  };

  const deleteQuestion = (questionId: number) => {
    if (window.confirm('Delete this question?')) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    }
  };

  const handleQuestionTextChange = (questionId: number, newText: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, question: newText } : q)));
  };

  const handleOptionChange = (questionId: number, optionIndex: number, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === optionIndex ? newText : opt)) }
          : q
      )
    );
  };

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, answer: optionIndex } : q)));
  };

  const handleDifficultyChange = (questionId: number, difficulty: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, difficulty } : q)));
  };

  const handleTopicChange = (questionId: number, topic_id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, topic_id, sub_topic_id: '' } : q)));
  };

  const handleSubTopicChange = (questionId: number, sub_topic_id: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, sub_topic_id } : q)));
  };

  const handleExplanationChange = (questionId: number, explanation: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, explanation } : q)));
  };

  // Create a temporary file input dynamically for image upload
  const triggerImageUpload = (questionId: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.webp';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0] || null;
      if (file) {
        handleImageUpload(questionId, file);
      }
      input.remove();
    };
    input.click();
  };

  const handleImageUpload = (questionId: number, file: File | null) => {
    setImageError('');
    if (!file) {
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, image: '' } : q)));
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Only JPG, JPEG, PNG, and WEBP formats are allowed.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, image: base64 } : q)));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (questionId: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, image: '' } : q)));
  };

  // Formatting bar: wrap selected text with tags
  const applyFormatting = (questionId: number, tag: 'b' | 'i' | 'u') => {
    const textarea = document.querySelector(`textarea[data-qid="${questionId}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const tags: Record<string, string> = { b: '<b>', i: '<i>', u: '<u>' };
    const closeTags: Record<string, string> = { b: '</b>', i: '</i>', u: '</u>' };

    if (selectedText) {
      const newText =
        textarea.value.substring(0, start) +
        tags[tag] + selectedText + closeTags[tag] +
        textarea.value.substring(end);
      setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, question: newText } : q)));
    }
  };

  // CSV Upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        alert('CSV must have a header row and at least one question.');
        return;
      }

      const newQuestions: QuestionItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length < 6) continue;

        const correctAns = parseInt(cols[5], 10);
        newQuestions.push({
          id: Date.now() + i,
          question: cols[0],
          options: [cols[1], cols[2], cols[3], cols[4]],
          answer: isNaN(correctAns) ? -1 : correctAns,
          difficulty: cols[6] || 'medium',
          topic_id: '',
          sub_topic_id: '',
          explanation: cols[7] || '',
        });
      }

      if (newQuestions.length > 0) {
        setQuestions((prev) => [...prev, ...newQuestions]);
        alert(`Successfully imported ${newQuestions.length} question(s) from CSV.`);
      } else {
        alert('No valid questions found in CSV. Expected format: question,option1,option2,option3,option4,correctIndex,difficulty,explanation');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadCSVTemplate = () => {
    const header = 'Question,Option1,Option2,Option3,Option4,CorrectOptionIndex,Difficulty,Explanation';
    const sample = 'What is 2+2?,3,4,5,6,1,easy,Basic addition';
    const blob = new Blob([header + '\n' + sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAndPreview = useCallback(async () => {
    // Validate at least one complete question
    const validQuestions = questions.filter(q => q.question.trim() && q.options.every(o => o.trim()) && q.answer >= 0);
    if (validQuestions.length === 0) {
      alert('Please add at least one complete question with all options and a correct answer.');
      return;
    }

    // Try API first, fallback to localStorage
    try {
      const payload = {
        questions: validQuestions.map(q => ({
          type: 'mcq',
          question: q.question,
          option1: q.options[0],
          option2: q.options[1],
          option3: q.options[2],
          option4: q.options[3],
          correct_option: `option${q.answer + 1}`,
          difficulty: q.difficulty,
          topic_id: q.topic_id || undefined,
          sub_topic_id: q.sub_topic_id || undefined,
          explanation: q.explanation || undefined,
          test_id: id,
        })),
      };
      await api.post('/questions/bulk', payload);
    } catch (err) {
      console.warn('Backend unavailable, saving locally.', err);
    }

    localStorage.setItem(`test-${id}-questions`, JSON.stringify(questions));
    localStorage.setItem(`test-${id}-questionCount`, String(validQuestions.length));
    navigate(`/tests/${id}/preview`);
  }, [questions, id, navigate]);

  return (
    <div className="add-questions">
      <header>
        <h1>Add Questions to Test (ID: {id})</h1>
        <div className="header-actions">
          <button onClick={downloadCSVTemplate} className="btn btn-outline" title="Download CSV Template">
            <FileSpreadsheet size={18} />
            <span>CSV Template</span>
          </button>
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleCSVUpload}
          />
          <button onClick={() => csvInputRef.current?.click()} className="btn btn-outline" title="Upload CSV">
            <Upload size={18} />
            <span>Upload CSV</span>
          </button>
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

      {imageError && (
        <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {imageError}
        </div>
      )}

      <div className="questions-list">
        {questions.map((q, index) => (
          <div key={q.id} className="question-card">
            <div className="question-header">
              <h3>Question {index + 1}</h3>
              <div className="question-header-actions">
                <span className={`difficulty-badge difficulty-${q.difficulty}`}>{q.difficulty}</span>
                <button onClick={() => deleteQuestion(q.id)} title="Delete" className="btn-icon">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="formatting-bar">
              <button
                type="button"
                className="format-btn"
                onClick={() => applyFormatting(q.id, 'b')}
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => applyFormatting(q.id, 'i')}
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={() => applyFormatting(q.id, 'u')}
                title="Underline"
              >
                <Underline size={16} />
              </button>
              <span className="formatting-hint">Select text, then click format button</span>
            </div>

            {/* Question Text */}
            <textarea
              data-qid={q.id}
              placeholder="Enter your question here... (use <b>, <i>, <u> tags for formatting)"
              value={q.question}
              onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
              rows={3}
            />

            {/* Image Upload Area */}
            <div className="image-upload-area">
              {q.image ? (
                <div className="image-preview-container">
                  <img src={q.image} alt="Question preview" className="question-image-preview" />
                  <button className="remove-image-btn" onClick={() => removeImage(q.id)} title="Remove image">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => triggerImageUpload(q.id)}
                >
                  <Image size={16} />
                  <span>Add Image (JPG, PNG, WEBP, max 5MB)</span>
                </button>
              )}
            </div>

            {/* Difficulty & Topic Row */}
            <div className="question-meta-row">
              <div className="meta-field">
                <label>Difficulty</label>
                <select
                  value={q.difficulty}
                  onChange={(e) => handleDifficultyChange(q.id, e.target.value)}
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="meta-field">
                <label>Topic</label>
                <select
                  value={q.topic_id}
                  onChange={(e) => handleTopicChange(q.id, e.target.value)}
                >
                  <option value="">Select topic</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="meta-field">
                <label>Sub-topic</label>
                <select
                  value={q.sub_topic_id}
                  onChange={(e) => handleSubTopicChange(q.id, e.target.value)}
                  disabled={!q.topic_id}
                >
                  <option value="">Select sub-topic</option>
                  {subTopics
                    .filter((st) => st.topic_id === q.topic_id)
                    .map((st) => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Options */}
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
                    onChange={(e) => handleOptionChange(q.id, i, e.target.value)}
                    className={q.answer === i ? 'correct-option' : ''}
                  />
                  {q.answer === i && <span className="correct-badge">Correct</span>}
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="explanation-field">
              <label>Explanation (Optional)</label>
              <textarea
                placeholder="Explain the correct answer..."
                value={q.explanation}
                onChange={(e) => handleExplanationChange(q.id, e.target.value)}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No questions added yet. Click "Add Question" or "Upload CSV" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AddQuestions;