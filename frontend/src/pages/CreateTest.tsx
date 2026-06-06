import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Subject {
  id: string;
  name: string;
}

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

const CreateTest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: 'practice',
    topics: [] as string[],
    sub_topics: [] as string[],
    difficulty: 'medium',
    correct_marks: 4,
    wrong_marks: -1,
    unattempt_marks: 0,
    total_time: 60,
    total_marks: 100,
    total_questions: 25,
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        if (res.success) setSubjects(res.data);
      } catch {
        setSubjects([
          { id: 'sub-1', name: 'Mathematics' },
          { id: 'sub-2', name: 'Physics' },
          { id: 'sub-3', name: 'Chemistry' },
          { id: 'sub-4', name: 'Biology' },
        ]);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    if (!formData.subject) {
      setTopics([]);
      return;
    }
    const loadTopics = async () => {
      try {
        const res = await api.get(`/topics/subject/${formData.subject}`);
        if (res.success) setTopics(res.data);
      } catch {
        const mockTopics: Record<string, Topic[]> = {
          'sub-1': [
            { id: 'topic-1', name: 'Algebra', subject_id: 'sub-1' },
            { id: 'topic-2', name: 'Geometry', subject_id: 'sub-1' },
            { id: 'topic-3', name: 'Trigonometry', subject_id: 'sub-1' },
          ],
          'sub-2': [
            { id: 'topic-4', name: 'Mechanics', subject_id: 'sub-2' },
            { id: 'topic-5', name: 'Thermodynamics', subject_id: 'sub-2' },
          ],
          'sub-3': [
            { id: 'topic-6', name: 'Organic Chemistry', subject_id: 'sub-3' },
            { id: 'topic-7', name: 'Inorganic Chemistry', subject_id: 'sub-3' },
          ],
          'sub-4': [
            { id: 'topic-8', name: 'Genetics', subject_id: 'sub-4' },
            { id: 'topic-9', name: 'Ecology', subject_id: 'sub-4' },
          ],
        };
        setTopics(mockTopics[formData.subject] || []);
      }
    };
    loadTopics();
  }, [formData.subject]);

  useEffect(() => {
    if (!selectedTopicId) {
      setSubTopics([]);
      return;
    }
    const loadSubTopics = async () => {
      try {
        const res = await api.get(`/sub-topics/topic/${selectedTopicId}`);
        if (res.success) setSubTopics(res.data);
      } catch {
        const mockSubTopics: Record<string, SubTopic[]> = {
          'topic-1': [
            { id: 'subtopic-1', name: 'Linear Equations', topic_id: 'topic-1' },
            { id: 'subtopic-2', name: 'Quadratic Equations', topic_id: 'topic-1' },
          ],
          'topic-2': [
            { id: 'subtopic-3', name: 'Triangles', topic_id: 'topic-2' },
            { id: 'subtopic-4', name: 'Circles', topic_id: 'topic-2' },
          ],
          'topic-4': [
            { id: 'subtopic-5', name: 'Newton Laws', topic_id: 'topic-4' },
            { id: 'subtopic-6', name: 'Kinematics', topic_id: 'topic-4' },
          ],
        };
        setSubTopics(mockSubTopics[selectedTopicId] || []);
      }
    };
    loadSubTopics();
  }, [selectedTopicId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTopicToggle = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topicId)
        ? prev.topics.filter(t => t !== topicId)
        : [...prev.topics, topicId],
    }));
  };

  const handleSubTopicToggle = (subTopicId: string) => {
    setFormData(prev => ({
      ...prev,
      sub_topics: prev.sub_topics.includes(subTopicId)
        ? prev.sub_topics.filter(s => s !== subTopicId)
        : [...prev.sub_topics, subTopicId],
    }));
  };

  const handleSave = async (status: string) => {
    if (!formData.name || !formData.subject) {
      setError('Test Name and Subject are required.');
      return;
    }
    setLoading(true);
    setError('');

    const mockId = `test-${Date.now()}`;

    try {
      const payload = {
        ...formData,
        status: status === 'draft' ? null : 'pending',
      };
      const res = await api.post('/tests', payload);
      if (res.success && res.data) {
        const testId = res.data.id;
        // Save test info for preview
        localStorage.setItem(`test-${testId}-info`, JSON.stringify({
          title: formData.name,
          subject: subjects.find(s => s.id === formData.subject)?.name || formData.subject,
          type: formData.type,
          difficulty: formData.difficulty,
          total_time: formData.total_time,
          total_marks: formData.total_marks,
          correct_marks: formData.correct_marks,
          wrong_marks: formData.wrong_marks,
          unattempt_marks: formData.unattempt_marks,
        }));
        if (status === 'draft') {
          navigate('/dashboard');
        } else {
          navigate(`/tests/${testId}/questions`);
        }
        return;
      }
    } catch {
      // Backend unavailable — use mock
    }

    // Mock save
    localStorage.setItem(`test-${mockId}-info`, JSON.stringify({
      title: formData.name,
      subject: subjects.find(s => s.id === formData.subject)?.name || formData.subject,
      type: formData.type,
      difficulty: formData.difficulty,
      total_time: formData.total_time,
      total_marks: formData.total_marks,
      correct_marks: formData.correct_marks,
      wrong_marks: formData.wrong_marks,
      unattempt_marks: formData.unattempt_marks,
    }));

    if (status === 'draft') {
      navigate('/dashboard');
    } else {
      navigate(`/tests/${mockId}/questions`);
    }
    setLoading(false);
  };

  return (
    <div className="create-test">
      <header>
        <h1>Create New Test</h1>
      </header>

      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="form-card">
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Test Details
        </h3>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Test Name *</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Mathematics Final Exam"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select className="form-control" name="subject" value={formData.subject} onChange={handleChange} required>
              <option value="">Select a subject</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Test Type</label>
            <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
              <option value="practice">Practice</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Level</label>
            <select className="form-control" name="difficulty" value={formData.difficulty} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input type="number" className="form-control" name="total_time" value={formData.total_time} onChange={handleChange} min={1} max={480} />
          </div>

          <div className="form-group">
            <label className="form-label">Total Questions</label>
            <input type="number" className="form-control" name="total_questions" value={formData.total_questions} onChange={handleChange} min={1} />
          </div>

          <div className="form-group">
            <label className="form-label">Total Marks</label>
            <input type="number" className="form-control" name="total_marks" value={formData.total_marks} onChange={handleChange} min={1} />
          </div>
        </div>

        {/* Topics Selection */}
        {formData.subject && topics.length > 0 && (
          <>
            <h3 style={{ margin: '2rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Topics
            </h3>
            <div className="checkbox-group">
              {topics.map(topic => (
                <label key={topic.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.topics.includes(topic.id)}
                    onChange={() => handleTopicToggle(topic.id)}
                  />
                  {topic.name}
                </label>
              ))}
            </div>
          </>
        )}

        {/* Sub-topics dropdown (depends on selected topics) */}
        {formData.topics.length > 0 && (
          <>
            <h3 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Sub-topics
            </h3>
            <div className="form-group">
              <label className="form-label">Select Topic for Sub-topics</label>
              <select
                className="form-control"
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
              >
                <option value="">Choose a topic</option>
                {topics.filter(t => formData.topics.includes(t.id)).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            {selectedTopicId && subTopics.length > 0 && (
              <div className="checkbox-group">
                {subTopics.map(st => (
                  <label key={st.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.sub_topics.includes(st.id)}
                      onChange={() => handleSubTopicToggle(st.id)}
                    />
                    {st.name}
                  </label>
                ))}
              </div>
            )}
          </>
        )}

        {/* Marking Scheme */}
        <h3 style={{ margin: '2rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          Marking Scheme
        </h3>
        <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="form-group">
            <label className="form-label">Correct Answer</label>
            <input type="number" className="form-control" name="correct_marks" value={formData.correct_marks} onChange={handleChange} />
            <small style={{ color: 'var(--text-muted)' }}>Marks awarded</small>
          </div>
          <div className="form-group">
            <label className="form-label">Wrong Answer</label>
            <input type="number" className="form-control" name="wrong_marks" value={formData.wrong_marks} onChange={handleChange} />
            <small style={{ color: 'var(--text-muted)' }}>Negative marking</small>
          </div>
          <div className="form-group">
            <label className="form-label">Unattempted</label>
            <input type="number" className="form-control" name="unattempt_marks" value={formData.unattempt_marks} onChange={handleChange} />
            <small style={{ color: 'var(--text-muted)' }}>Marks for unattempted</small>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <button type="button" className="btn" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="button" className="btn btn-outline" onClick={() => handleSave('draft')} disabled={loading}>
            {loading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleSave('next')} disabled={loading}>
            {loading ? 'Saving...' : 'Next: Add Questions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;