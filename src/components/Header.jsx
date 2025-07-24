import { useEffect, useState } from "react";

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

  // if (!userRole) {
  //   return null;
  // }

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
            {/* <span className="user-email">{userEmail}</span> */}
          </div>
        </div>
      </div>
    </header>
  );
}
