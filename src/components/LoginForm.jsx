import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const url = isLogin
      ? "http://localhost:8000/api/auth/login"
      : "http://localhost:8000/api/auth/register";

    const payload = isLogin
      ? { email: username, password }
      : { email: username, password, role };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);

          setTimeout(() => {
            if (data.user.role === "teacher") {
              navigate("/admin");
            } else if (data.user.role === "student") {
              navigate("/student");
            } else {
              setError("Unknown role, cannot redirect.");
            }
          }, 1000);
        } else {
          setError("Registration successful! Please log in.");
          setTimeout(() => {
            setIsLogin(true);
            setError("");
          }, 2000);
        }
      } else {
        setError(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p>
          {isLogin ? "Sign in to your account" : "Join our learning platform"}
        </p>
      </div>

      {error && (
        <div className="form-message form-error">
          <span className="message-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {!isLogin && (
          <>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn-submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              {isLogin ? "Signing In..." : "Creating Account..."}
            </>
          ) : (
            <>
              <span className="btn-icon">{isLogin ? "" : "✨"}</span>
              {isLogin ? "Sign In" : "Create Account"}
            </>
          )}
        </button>
      </form>

      <div className="form-footer">
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          type="button"
          className="btn-toggle"
          onClick={toggleMode}
          disabled={isLoading}
        >
          {isLogin ? "Create Account" : "Sign In"}
        </button>
      </div>
    </div>
  );
}
