// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      {/* Left Side - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="brand-logo">
            <div className="logo-icon">📚</div>
            <h1 className="brand-title">MCQ Portal</h1>
          </div>
          <div className="brand-description">
            <h2>Welcome to the Future of Learning</h2>
            <p>Create, manage, and take interactive quizzes with our comprehensive MCQ platform designed for educators and students.</p>
          </div>
          <div className="brand-features">
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Smart Assessment Tools</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Detailed Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure & Reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-form-container">
        <div className="form-wrapper">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
