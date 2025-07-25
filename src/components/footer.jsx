import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import "./footer.css";

export default function footer() {
  return (
    <footer
      className="footer"
      style={{
        display: "flex",
      }}
    >
      <div className="footer-section brand">
        <h2>Quizzer</h2>
        <p>Test your knowledge. Learn more every day.</p>
      </div>

      {/* <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/quizzes">Quizzes</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div> */}

      <div className="footer-section social" style={{ alignSelf: "flex-end" }}>
        <h4>Follow Me </h4>
        <div className="social-icons">
          <a href="#">
            <FaFacebookF />
          </a>
          <a href="#">
            <FaTwitter />
          </a>
          <a href="#">
            <FaInstagram />
          </a>
          <a href="#">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
