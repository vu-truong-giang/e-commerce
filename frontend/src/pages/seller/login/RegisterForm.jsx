import { Form, Button } from "react-bootstrap";
import API_BASE_URL from "../../../config/api";

export default function RegisterForm() {
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm_password = e.target.confirm_password.value;

    if (password !== confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, confirm_password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Register failed");
        return;
      }

      alert("Register successful! Please check your email to confirm.");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <Form onSubmit={handleRegister}>
      <Form.Group className="mb-3">
        <Form.Label>Full Name</Form.Label>
        <Form.Control name="name" type="text" placeholder="Enter your name" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control name="email" type="email" placeholder="Enter your email" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control name="password" type="password" placeholder="Password" required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control name="confirm_password" type="password" placeholder="Confirm Password" required />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100 mt-2">
        Create Account
      </Button>
    </Form>
  );
}
