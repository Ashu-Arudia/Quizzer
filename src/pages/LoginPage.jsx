import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AnalysisIcon from "../icons/analytics.png";
import QuizIcon from "../icons/quiz.png";
import secureIcon from "../icons/secure.png";
import toolsIcon from "../icons/tools.png";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const handlelogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (in ms)
      once: false, // Whether animation should happen only once
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Each layer scrolls at a different rate
      document.querySelector(".feature-item1").style.transform = `translateY(${
        -scrollY * 0.6
      }px)`;
      document.querySelector(".feature-item2").style.transform = `translateY(${
        -scrollY * 0.8
      }px)`;
      document.querySelector(".feature-item3").style.transform = `translateY(${
        -scrollY * 1.2
      }px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <img
                src={QuizIcon}
                alt="Quiz Logo"
                style={{ width: "200px", height: "auto", padding: "30px" }}
              />

              <h1
                className="brand-title"
                style={{
                  fontWeight: "bold",
                  color: "#222222",
                  fontFamily: "Inter Tight",
                  fontSize: "100px",
                }}
              >
                Quizzer
              </h1>
            </div>
            <div className="brand-description">
              <h2>Welcome to the Future of Learning</h2>
              <p>
                Create, manage, and take interactive quizzes with our
                <br />
                comprehensive MCQ platform designed for educators and students.
              </p>
            </div>
            <div
              style={{
                marginTop: "100px",
                zIndex: "20",
                // backgroundColor: "red",
              }}
            >
              <h1
                style={{
                  fontFamily: "Work Sans",
                  fontSize: "90px",
                  textAlign: "center",
                  fontWeight: "lighter",
                  marginBottom: "50px",
                  color: "black",
                }}
              >
                Create Your Own Quizzes Quizzers!!
              </h1>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={handlelogin} className="btng">
                  Get Started!
                </button>
              </div>
            </div>
            <div className="brand-features">
              <div className="wrapper">
                <div className="feature-item1">
                  <img
                    src={toolsIcon}
                    alt="tools"
                    style={{ width: "100px", height: "auto", padding: "30px" }}
                  />
                  <span>Smart Assessment Tools</span>
                </div>
                <div className="feature-item2">
                  <img
                    src={AnalysisIcon}
                    alt="Analysis"
                    style={{ width: "100px", height: "auto", padding: "30px" }}
                  />
                  <span>Detailed Analytics</span>
                </div>
                <div className="feature-item3">
                  <img
                    src={secureIcon}
                    alt="secure"
                    style={{ width: "100px", height: "auto", padding: "30px" }}
                  />
                  <span>Secure & Reliable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
