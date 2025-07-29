import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Account from "../icons/acc.png";

export default function Header() {
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const hideLogoutPaths = ["/login", "/signup", "/"];
  const isAuthPage = hideLogoutPaths.includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
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
          zIndex: 1000,
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
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "transparent",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          className="header-brand"
          style={{ display: "flex", color: "#222222" }}
        >
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

        {/* Right side: Account menu */}
        <div style={{ position: "relative" }}>
          <div
            onClick={toggleDropdown}
            style={{
              width: "55px",
              height: "45px",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "40px",
            }}
          >
            <img
              src={Account}
              alt="Account"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: 0,
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "4px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                overflow: "hidden",
                minWidth: "150px",
                zIndex: 1001,
              }}
            >
              <div
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/account");
                }}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                }}
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "grey")
                }
              >
                Account
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: "10px 15px",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "grey")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
}
