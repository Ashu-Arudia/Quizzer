import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
import ProtectedRoute from "./components/protectedroute";
import AdminPage from "./pages/AdminPage";
import AdminPage0 from "./pages/AdminPage0";
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <Router>
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher0"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <AdminPage0 />
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
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
