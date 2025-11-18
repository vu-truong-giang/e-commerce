import { useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showChoice, setShowChoice] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Form submitted");
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      console.log("Sending login request to: /api/login");
      console.log("Payload:", { email, password });
      
      // Thêm timeout 10 giây
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log("Response received", res);
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);

      const data = await res.json();

      console.log("Data parsed:", data);
      
      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // Lưu token nếu server trả về
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Lưu user vào state để dùng trong modal
      setUserData(data.user || data);

      // Kiểm tra role
      const role = data.user?.role || data.role;
      console.log("User role:", role);
      
      if (role === "seller") {
        setShowChoice(true);
      } else {
        navigate("/user");
      }
    } catch (err) {
      console.error("Error caught:", err);
      console.error("Error message:", err.message);
      console.error("Error name:", err.name);
      
      if (err.name === 'AbortError') {
        alert("Request timeout - Backend không phản hồi trong 10 giây");
      } else {
        alert("Error connecting to server: " + err.message);
      }
    }
  };

  return (
    <>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">
          Login
        </Button>
      </Form>

      {/* Modal chọn trang */}
      {userData && (
        <Modal show={showChoice} onHide={() => setShowChoice(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Choose Dashboard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Chào {userData.name}, bạn muốn vào trang nào?</p>
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="secondary" onClick={() => navigate("/user")}>
                User Site
              </Button>
              <Button variant="primary" onClick={() => navigate("/seller")}>
                Seller Dashboard
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
