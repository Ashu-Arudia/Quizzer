import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = "https://quizzer-jqif.onrender.com/api/auth/google";
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const url = "https://quizzer-jqif.onrender.com/api/auth/login";
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
          minHeight: "530px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Top Section */}
        <div>
          <div style={{ marginBottom: "30px", textAlign: "center" }}>
            <h2 style={{ margin: "0", fontWeight: "bold", color: "#fff" }}>
              Welcome Back
            </h2>
            <p style={{ marginTop: "25px", color: "#ccc" }}>
              Sign in to your Quizzer account!
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
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#fff",
                }}
              >
                Username
              </label>
              <input
                type="text"
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
                  marginBottom: "5px",
                }}
                placeholder=""
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  color: "#fff",
                }}
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
                placeholder=""
              />
            </div>
          </form>
        </div>

        {/* Bottom Section */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#444",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              style={{
                width: "18px",
                height: "18px",
                marginRight: "10px",
              }}
            />
            Google
          </button>
        </div>
      </div>
    </div>
  );
}
