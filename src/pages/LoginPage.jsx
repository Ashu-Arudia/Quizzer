// src/pages/LoginPage.jsx
import './LoginPage.css';
import LoginForm from '../components/LoginForm';
export default function LoginPage() {
  return (
    <>
    <div style={{border: '2px solid black', borderRadius: '20px'}}>
    <div style={{ padding: 30 }}>
    <h1 style={{textAlign: 'center',paddingBottom:'10px'}}>Quizz App</h1>
      <LoginForm />
    </div>
    </div>
    </>
  );
}
