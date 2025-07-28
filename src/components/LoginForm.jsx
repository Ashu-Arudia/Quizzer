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

  // Google login/signup success handler
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const url = "http://localhost:8000/api/auth/login";

    const payload = { username, password };

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
        localStorage.setItem("token", data.token);
        setTimeout(() => {
          if (data.user.role === "teacher") {
            navigate("/teacher0");
          } else if (data.user.role === "student") {
            navigate("/student");
          } else {
            setError("Unknown role, cannot redirect.");
          }
        }, 1000);
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
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#111",
          padding: "40px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: isLogin ? "540px" : "750px",
          overflowY: "auto",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ margin: "0", fontWeight: "bold", color: "#fff" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ marginTop: "10px", color: "#ccc" }}>
            {isLogin ? "Sign in to your account" : "Join our learning platform"}
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ff4444",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{ display: "block", marginBottom: "5px", color: "#fff" }}
            >
              {isLogin ? "Email Address" : "Username / Email"}
            </label>
            <input
              type={isLogin ? "email" : "text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "#fff",
              }}
              placeholder={isLogin ? "example@gmail.com" : "Username or email"}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{ display: "block", marginBottom: "5px", color: "#fff" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "#fff",
              }}
              placeholder="Password"
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#fff",
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#222",
                    color: "#fff",
                  }}
                  placeholder="Repeat password"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#fff",
                  }}
                >
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #444",
                    backgroundColor: "#222",
                    color: "#fff",
                  }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            {isLoading
              ? isLogin
                ? "Signing In..."
                : "Creating Account..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>
        </form>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Divider */}
          <div style={{ margin: "20px 0", textAlign: "center", color: "#999" }}>
            — OR —
          </div>

          {/* Google Login */}
          <div style={{ textAlign: "center" }}>
            <h2>Login</h2>
            <button onClick={handleGoogleLogin}>Sign in with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
}
