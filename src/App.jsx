import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CareersPage from './pages/CareersPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CareersPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
