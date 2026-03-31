import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import FormPage from './pages/FormPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  );
}

export default App;
