import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const hideLogoutPaths = ["/login", "/signup", "/"];
  const isAuthPage = hideLogoutPaths.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role && token) {
      setUserRole(role);
      setUserEmail(`${role.charAt(0).toUpperCase() + role.slice(1)} Account`);
    }
  }, []);

  if (isAuthPage) {
    return (
      <header
        className="app-header"
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "transparent",
          zIndex: 1000 /* stays above other elements */,
        }}
      >
        <div
          className="header-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            position: "sticky",
            top: 0,
            zIndex: "1000",
          }}
        >
          <div className="header-brand" style={{ display: "flex" }}>
            <div
              className="brand-title"
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight",
                fontSize: "14px",
                paddingRight: "10px",
              }}
            >
              Quizzer
            </div>
            <div
              className="brand-title"
              style={{
                fontFamily: "Inter Tight",
                fontSize: "14px",
                paddingRight: "10px",
                fontWeight: "5",
              }}
            >
              by
            </div>
            <div
              className="brand-title"
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight",
                fontSize: "14px",
              }}
            >
              Aarav Arudia
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              // padding: "10px 20px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <div
              onClick={handleLogin}
              style={{
                padding: "8px 16px",
                backgroundColor: "#222222",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Login
            </div>
          </div>
        </div>
      </header>
    );
  }
  if (!isAuthPage) {
    return (
      <header
        className="app-header"
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "transparent",
          zIndex: 1000 /* stays above other elements */,
        }}
      >
        <div
          className="header-content"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            position: "sticky",
            top: 0,
            zIndex: "1000",
          }}
        >
          <div className="header-brand" style={{ display: "flex" }}>
            <div
              className="brand-title"
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight",
                fontSize: "14px",
                paddingRight: "10px",
              }}
            >
              Quizzer
            </div>
            <div
              className="brand-title"
              style={{
                fontFamily: "Inter Tight",
                fontSize: "14px",
                paddingRight: "10px",
                fontWeight: "5",
              }}
            >
              by
            </div>
            <div
              className="brand-title"
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight",
                fontSize: "14px",
              }}
            >
              Aarav Arudia
            </div>
          </div>

          <div className="header-user">
            <div className="user-info">
              <span className="user-email">Logout</span>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
