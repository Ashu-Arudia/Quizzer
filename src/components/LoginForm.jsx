import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const url = isLogin
      ? "http://localhost:8000/api/login"
      : "http://localhost:8000/api/register";

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
          alert("Login successful!");
          navigate("/admin");
        } else {
          alert("Registration successful! Now log in.");
          setIsLogin(true);
        }
      } else {
        alert(data.msg || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error. Try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />

        {!isLogin && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <br />
            <br />

            <label>
              Select Role: &nbsp;
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </label>
            <br />
            <br />
          </>
        )}

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <br />
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        &nbsp;
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ cursor: "pointer" }}
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
