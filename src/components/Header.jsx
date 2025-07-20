import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role && token) {
      setUserRole(role);
      setUserEmail(`${role.charAt(0).toUpperCase() + role.slice(1)} Account`);
    }
  }, []);

  if (!userRole) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <span className="brand-icon">📚</span>
          <h1 className="brand-title">MCQ Portal</h1>
        </div>

        <div className="header-user">
          <div className="user-info">
            <span className="user-role-icon">
              {userRole === "teacher" ? "👨‍🏫" : "👨‍🎓"}
            </span>
            <span className="user-email">{userEmail}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
