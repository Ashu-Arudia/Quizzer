import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Account from "../icons/acc.png";

export default function Header() {
  const [userRole, setUserRole] = useState("N/A");
  const [userEmail, setUserEmail] = useState("N/A");
  const [userName, setUserName] = useState("N/A");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token || isAuthPage) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://quizzer-jqif.onrender.com/api/user/profile",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUserEmail(data.email || "N/A");
        setUserName(data.username || "N/A");
        setUserRole(data.role || "N/A");
      } catch (err) {
        setError(err.message);
        setUserEmail("N/A");
        setUserName("N/A");
        setUserRole("N/A");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthPage]);

  if (isAuthPage) {
    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "transparent",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
            position: "sticky",
            top: 0,
            zIndex: "1000",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight, sans-serif",
                fontSize: "14px",
                paddingRight: "10px",
              }}
            >
              Quizzer
            </div>
            <div
              style={{
                fontFamily: "Inter Tight, sans-serif",
                fontSize: "14px",
                paddingRight: "10px",
                fontWeight: "500",
              }}
            >
              by
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontFamily: "Inter Tight, sans-serif",
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
              className="login-button"
              style={{
                padding: "8px 16px",
                backgroundColor: "#222222",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "opacity 0.3s",
              }}
            >
              Login
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .login-button:hover {
            opacity: 0.8;
          }
          .login-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(34, 34, 34, 0.3);
          }
          .account-icon:hover {
            background-color: #f3f4f6;
          }
          .account-icon:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
          }
          .dropdown-item:hover {
            background-color: #f3f4f6;
          }
          .dropdown-item:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
          }
          .logout-button:hover {
            background-color: #dc2626;
          }
          .logout-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.3);
          }
        `}
      </style>
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
        <div style={{ display: "flex", color: "#222222" }}>
          <div
            style={{
              fontWeight: "bold",
              fontFamily: "Inter Tight, sans-serif",
              fontSize: "14px",
              paddingRight: "10px",
            }}
          >
            Quizzer
          </div>
          <div
            style={{
              fontFamily: "Inter Tight, sans-serif",
              fontSize: "14px",
              paddingRight: "10px",
              fontWeight: "500",
            }}
          >
            by
          </div>
          <div
            style={{
              fontWeight: "bold",
              fontFamily: "Inter Tight, sans-serif",
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
            className="account-icon"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s",
            }}
          >
            <img
              src={Account}
              alt="Account"
              style={{ width: "100%", height: "100%", borderRadius: "50%" }}
            />
          </div>

          {/* Dropdown Card */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                minWidth: "200px",
                zIndex: 1001,
                padding: "12px",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#4b5563",
                    textAlign: "center",
                  }}
                >
                  Loading...
                </div>
              ) : error ? (
                <div
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    color: "#dc2626",
                    textAlign: "center",
                  }}
                >
                  Error: {error}
                </div>
              ) : (
                <>
                  <div
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid #e5e7eb",
                      marginBottom: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "4px",
                      }}
                    >
                      {userName}
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#4b5563",
                        marginBottom: "4px",
                      }}
                    >
                      {userEmail}
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#4b5563",
                        textTransform: "capitalize",
                      }}
                    >
                      Role: {userRole}
                    </p>
                  </div>
                  {/* <div
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/account");
                    }}
                    className="dropdown-item"
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#1f2937",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Account Settings
                  </div> */}
                  <div
                    onClick={handleLogout}
                    className="logout-button"
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#ffffff",
                      backgroundColor: "#ef4444",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginTop: "8px",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Logout
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
