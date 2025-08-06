import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
import SignupPage from "./components/SignupForm";
import AdminPage0 from "./pages/AdminPage0";
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/quiz";
import QuizDetails from "./pages/QuizDetails";
import Quizform from "./pages/QuizForm";
import StudentPage from "./pages/StudentPage";

function App() {
  return (
    <GoogleOAuthProvider clientId="238130956337-ns9kmuapb0oat3l68kicofeb8c2556ki.apps.googleusercontent.com">
      <Router>
        <div className="app">
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/signup"
                element={
                  // <ProtectedRoute allowedRoles={["new"]}>
                  <SignupPage />
                  // </ProtectedRoute>
                }
              />
              <Route path="/teacher0" element={<AdminPage0 />} />
              <Route path="/student/quiz/:quizId" element={<QuizPage />} />
              <Route path="/teacher/quiz/:Id" element={<QuizDetails />} />
              <Route path="/student" element={<StudentPage />} />
              <Route path="/teacher/quizform" element={<Quizform />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
