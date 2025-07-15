// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student" element={<StudentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
