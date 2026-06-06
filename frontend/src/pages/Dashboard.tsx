import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';

interface Test {
  id: string;
  title: string;
  questions: number;
  status: string;
}

const initialTests: Test[] = [
  { id: '1', title: 'React Basics Quiz', questions: 10, status: 'Published' },
  { id: '2', title: 'Advanced JavaScript', questions: 25, status: 'Draft' },
  { id: '3', title: 'CSS Grid Challenge', questions: 15, status: 'Published' },
];

const Dashboard = () => {
  const [tests, setTests] = useState<Test[]>(initialTests);

  const handleDelete = (testId: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/tests/create" className="btn btn-primary">
          <PlusCircle size={20} />
          <span>Create New Test</span>
        </Link>
      </header>
      <div className="test-list">
        <table>
          <thead>
            <tr>
              <th>Test Title</th>
              <th>Questions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.title}</td>
                <td>{test.questions}</td>
                <td>
                  <span className={`status-badge status-${test.status.toLowerCase()}`}>
                    {test.status}
                  </span>
                </td>
                <td className="actions">
                  <Link to={`/tests/${test.id}/preview`} title="Preview">
                    <Eye size={18} />
                  </Link>
                  <Link to={`/tests/${test.id}/questions`} title="Edit Questions">
                    <Edit size={18} />
                  </Link>
                  <button onClick={() => handleDelete(test.id)} title="Delete" className="btn-icon">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;