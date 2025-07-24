import Header from "../components/Header";
import Loginform from "../components/LoginForm";
import "./Login.css";

export default function Login() {
  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <Loginform />
      </div>
    </>
  );
}
