import { useState } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Card style={{ width: "380px" }} className="shadow p-4 rounded-4">
        <h2 className="text-center mb-4 fw-bold">
          {isLogin ? "Login" : "Register"}
        </h2>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="text-center mt-3">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
