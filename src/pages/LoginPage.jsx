import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AnalysisIcon from "../icons/analytics.png";
import QuizIcon from "../icons/quiz.png";
import secureIcon from "../icons/secure.png";
import toolsIcon from "../icons/tools.png";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const featureRef1 = useRef(null);
  const featureRef2 = useRef(null);
  const featureRef3 = useRef(null);

  const handlelogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (featureRef1.current) {
        featureRef1.current.style.transform = `translateY(${-scrollY * 0.6}px)`;
      }
      if (featureRef2.current) {
        featureRef2.current.style.transform = `translateY(${-scrollY * 0.8}px)`;
      }
      if (featureRef3.current) {
        featureRef3.current.style.transform = `translateY(${-scrollY * 1.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header />
      <div className={styles["login-page"]}>
        <div className={styles["login-branding"]}>
          <div className={styles["branding-content"]}>
            <div className={styles["brand-logo"]}>
              <img
                src={QuizIcon}
                alt="Quiz Logo"
                style={{ width: "200px", height: "auto", padding: "30px" }}
              />
              <h1
                className={styles["brand-title"]}
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
            <div className={styles["brand-description"]}>
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
                <button onClick={handlelogin} className={styles["btng"]}>
                  Get Started!
                </button>
              </div>
            </div>

            <div className={styles["brand-features"]}>
              <div className={styles["wrapper"]}>
                <div ref={featureRef1} className={styles["feature-item1"]}>
                  <img
                    src={toolsIcon}
                    alt="tools"
                    style={{ width: "100px", height: "auto", padding: "30px" }}
                  />
                  <span>Smart Assessment Tools</span>
                </div>
                <div ref={featureRef2} className={styles["feature-item2"]}>
                  <img
                    src={AnalysisIcon}
                    alt="Analysis"
                    style={{ width: "100px", height: "auto", padding: "30px" }}
                  />
                  <span>Detailed Analytics</span>
                </div>
                <div ref={featureRef3} className={styles["feature-item3"]}>
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
