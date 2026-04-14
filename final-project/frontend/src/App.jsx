import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import SubmissionsPage from "./pages/SubmissionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
    </Routes>
  );
}

export default App;
