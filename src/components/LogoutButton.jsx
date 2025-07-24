import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as LogoutIcon } from "../icons/logout.svg";
import { ReactComponent as ProfileIcon } from "../icons/profile.svg";

export default function LogoutButton() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  const handleProfile = () => {
    navigate("/");
  };

  return (
    <>
      <button
        onClick={handleProfile}
        onMouseEnter={() => setHovered2(true)}
        onMouseLeave={() => setHovered2(false)}
        style={{
          border: "1px solid white",
          cursor: "pointer",
          backgroundColor: "white",
          paddingRight: "20px",
        }}
        title=""
      >
        <ProfileIcon
          style={{
            width: "30px",
            height: "30px",
            transition: "fill 0.2s ease",
            transform: hovered2 ? "scale(1.1)" : "scale(1)",
            opacity: hovered2 ? "0.5" : "1",
          }}
        />
      </button>
      <button
        onClick={handleLogout}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: "1px solid white",
          cursor: "pointer",
          backgroundColor: "white",
          transform: "translateY(-4px)",
        }}
        title=""
      >
        <LogoutIcon
          style={{
            width: "21px",
            height: "19px",
            transition: "fill 0.2s ease",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            opacity: hovered ? "0.5" : "1",
          }}
        />
      </button>
    </>
  );
}
