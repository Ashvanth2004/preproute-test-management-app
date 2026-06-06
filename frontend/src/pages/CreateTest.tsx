import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestId = Date.now().toString();
    navigate(`/tests/${newTestId}/questions`);
  };

  return (
    <div className="create-test">
      <header>
        <h1>Create New Test</h1>
      </header>
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="test-title">Test Title</label>
          <input
            id="test-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 'React Fundamentals'"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="test-duration">Duration (minutes)</label>
          <input
            id="test-duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 60"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save and Add Questions
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;