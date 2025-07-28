import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage0() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    const existingToken = localStorage.getItem("token");

    if (tokenFromUrl) {
      const role = params.get("role");
      localStorage.setItem("role", role);
      localStorage.setItem("token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = tokenFromUrl || existingToken;

    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Welcome to Teacher Dashboard</h1>
    </div>
  );
}
