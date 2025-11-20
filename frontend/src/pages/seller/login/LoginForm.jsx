import { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSellerIdFromUserId , loginUser , checkEmailExists } from "../../../API/SellerAPI";


export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [role, setRole] = useState(null); // buyer | seller
  const [selectedOption, setSelectedOption] = useState("buyer");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setEmailExists(false);
        return;
      }
      setCheckingEmail(true);

      const data = await checkEmailExists(email); 
      
      console.log("Email check:", data.exists);

      setCheckingEmail(false);

      if (data.exists) {
        setEmailExists(true);
        setRole(data.role); // buyer | seller
      } else {
        setEmailExists(false);
        setRole(null);
      }
    };

    const delay = setTimeout(checkEmail, 500); // debounce 0.5s
    return () => clearTimeout(delay);
  }, [email]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted");

    if (!emailExists) {
      alert("Email không tồn tại!");
      return;
    }

    try {
      console.log("Sending login request");
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Sending login request to: /api/login");
      console.log("Payload:", { email, password });

      // Thêm timeout 10 giây
     
      const data = await loginUser(email, password);
      console.log("Data parsed:", data);

      // Lưu token nếu server trả về
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
    
      if (selectedOption === "buyer") {
        navigate(`/user/welcome/${data.id}`);
      } else if (selectedOption === "seller") {
        const sellerId = await getSellerIdFromUserId(data.id);
        navigate(`/seller/dashboard/${sellerId}`);
      }
    } catch (err) {
      console.error("Error caught:", err);
      console.error("Error message:", err.message);
      console.error("Error name:", err.name);

      if (err.name === "AbortError") {
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
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {checkingEmail && <small>Đang kiểm tra email...</small>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Hiện select khi email tồn tại */}
        {/* Select chỉ hiện nếu role = seller */}
        {role === "seller" && (
          <Form.Group className="mb-3">
            <Form.Label>Chọn chế độ đăng nhập</Form.Label>
            <Form.Select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">-- Chọn --</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </Form.Select>
          </Form.Group>
        )}

        <Button
          variant="primary"
          className="w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Login"}
        </Button>
      </Form>
    </>
  );
}
