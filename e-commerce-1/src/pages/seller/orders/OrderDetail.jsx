import { useParams, Link } from "react-router-dom";
import { useState } from "react"; // ⚠️ bạn quên import useState
import { orders } from "../../../assets/data/orderData";
import ProductItem from "../../../components/products/ProductItem";
import CardStatusItem from "../../../components/orders/CardStatusItem";
import PrintOrder from "./PrintOrder";

export default function OrderDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const order = orders.find((o) => o.id === id);

  // Nếu không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-600">
          Đơn hàng không tồn tại
        </h2>
        <Link
          to="/seller/orders"
          className="text-blue-600 underline mt-4 block"
        >
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  // ✅ Đặt state sau khi đã có order

  // ✅ Hàm xác nhận đơn

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center bg-primary text-white rounded">
          <h4 className="mb-0 fw-semibold">
            Chi tiết đơn hàng <span className="text-warning">{order.id}</span>
          </h4>
          <Link to="/seller/orders" className="btn btn-light btn-sm fw-medium">
            ← Quay lại
          </Link>
        </div>
      </div>

      {/* Thông tin đơn hàng */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light fw-semibold">
              👤 Thông tin khách hàng
            </div>
            <div className="card-body">
              <p>
                <strong>Tên khách hàng:</strong> {order.customer}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.phone}
              </p>
              <p>
                <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light fw-semibold">
              📦 Thông tin đơn hàng
            </div>
            <div className="card-body">
              <p>
                <strong>Ngày đặt hàng:</strong>{" "}
                {new Date(order.date).toLocaleString("vi-VN")}
              </p>
              <p>
                <strong>Trạng thái:</strong> <CardStatusItem status={order.status} />
                {/* ✅ Hiện nút xác nhận nếu đang chờ */}
                
              </p>

              <p>
                <strong>Địa chỉ nhận:</strong> <span>{order.address}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="card mt-4 shadow-sm border-0">
        <div className="card-header bg-light fw-semibold">
          🛍️ Sản phẩm trong đơn hàng
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Đơn giá</th>
                  <th scope="col">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <ProductItem
                    key={index}
                    number={index + 1}
                    name={item.name}
                    price={item.price}
                    quantity={item.qty}
                    totalItem={item.qty * item.price}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tổng kết */}
      <div className="d-flex justify-content-end mt-4">
        <div className="card border-0 shadow-sm" style={{ width: "320px" }}>
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Tổng kết thanh toán</h6>
            <div className="d-flex justify-content-between">
              <span>Tạm tính:</span>
              <span>{order.total.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí vận chuyển:</span>
              <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold text-danger">
              <span>Tổng cộng:</span>
              <span>
                {(order.total + order.shippingFee).toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </div>
      </div>

    <div className="d-flex gap-2 mt-4">
        {/* Nút in hóa đơn */}
      <PrintOrder order={{ ...order, status }} />
      <button className="btn btn-warning mb-3" >
        Xóa đơn hàng
      </button>
      </div>
      

    </div>
  );
}
