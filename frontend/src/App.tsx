import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateTest from './pages/CreateTest';
import AddQuestions from './pages/AddQuestions';
import PreviewPublish from './pages/PreviewPublish';
import Layout from './components/Layout';
import './App.css';

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tests/create" element={<CreateTest />} />
        <Route path="tests/:id/questions" element={<AddQuestions />} />
        <Route path="tests/:id/preview" element={<PreviewPublish />} />
        {/* Add a redirect for any old links pointing to /dashboard */}
        <Route path="dashboard" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
