import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  createSeller,
  getUserInformation,
  getSellerIdFromUserId,
  updateUserRoleToSeller,
} from "../../API/SellerAPI";

export default function Welcome() {
  const { userId } = useParams();
  console.log("userId param:", userId);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserInformation(userId);
      console.log("Fetched user data:", data);
      setUser(data);
    };
    fetchUser();
  }, [userId]);

  const handleSellerRegister = async () => {
    const sellerid = await getSellerIdFromUserId(userId);
    console.log(sellerid)
    if (sellerid) {
      navigate(`/seller/${sellerid}/dashboard`);
    } else {
      alert("Bạn chưa đăng ký Seller. Vui lòng đăng ký để tiếp tục.");
      const confirmRegister = window.confirm(
        "Bạn có muốn đăng ký làm Seller không?"
      );
      if (confirmRegister) {
        const result = await createSeller(userId);

        if (!result || !result.seller_id) {
          alert("Không tạo được seller!");
          console.error("Lỗi createSeller:", result);
          return;
        }

        await updateUserRoleToSeller(userId);

        navigate(`/seller/${result.seller_id}/dashboard`);
      }
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh", textAlign: "center" }}
    >
      <h1>Chào mừng bạn đến với hệ thống!</h1>

      {/* Nếu user chưa load xong */}
      {!user ? (
        <p>Đang tải thông tin...</p>
      ) : (
        <>
          <p>ID: {userId}</p>
          <p>Xin chào, {user.name}</p>
        </>
      )}

      <Button variant="primary" size="lg" onClick={handleSellerRegister}>
        Đăng ký làm Seller
      </Button>
    </div>
  );
}
