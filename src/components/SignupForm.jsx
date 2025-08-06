import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");
  localStorage.setItem("token", token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    const url = "https://quizzer-jqif.onrender.com/api/auth/register";
    const payload = { username, password, role, token };

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
        setError("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.msg || "Something went wrong");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Create Your Free Account</h2>
          <p style={styles.subtitle}>Join as a student or teacher</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                placeholder="Your username"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter password"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Confirm password"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.input}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button type="submit" disabled={isLoading} style={styles.button}>
              {isLoading ? "Creating Account..." : "Create Your Account"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formBox: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "40px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#aaa",
  },
  field: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#ccc",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  errorBox: {
    backgroundColor: "#ff4444",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  switchText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#aaa",
  },
  switchLink: {
    color: "#4da6ff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
