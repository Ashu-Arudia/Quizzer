// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/protectedroute";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
