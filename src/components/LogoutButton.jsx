import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout} title="Logout">
      <span className="logout-text">Logout</span>
    </button>
  );
}
