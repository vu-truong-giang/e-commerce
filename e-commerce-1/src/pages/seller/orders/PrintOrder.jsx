// src/components/orders/PrintOrder.jsx
import React, { useRef } from "react";

export default function PrintOrder({ order }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Phiếu giao hàng</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            .flex { display: flex; justify-content: space-between; }
            .box { width: 48%; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <button className="btn btn-primary mb-3" onClick={handlePrint}>
        In đơn hàng
      </button>

      <div ref={printRef} style={{ display: "none" }}>
        <div className="flex">
          {/* Thông tin shop */}
          <div className="box">
            <h4>Shop ABC</h4>
            <p>Địa chỉ: 123 Đường XYZ, Quận 1</p>
            <p>Điện thoại: 0901xxxxxx</p>
          </div>

          {/* Thông tin khách hàng */}
          <div className="box">
            <h4>Người nhận</h4>
            <p>Tên: {order.customer}</p>
            <p>SĐT: {order.phone}</p>
            <p>Địa chỉ: {order.address}</p>
            <p>Phương thức thanh toán: {order.paymentMethod}</p>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString("vi-VN")}₫</td>
                <td>{(item.price * item.qty).toLocaleString("vi-VN")}₫</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "10px", textAlign: "right" }}>
          <p>Tạm tính: {order.total.toLocaleString("vi-VN")}₫</p>
          <p>Phí vận chuyển: {order.shippingFee.toLocaleString("vi-VN")}₫</p>
          <p style={{ fontWeight: "bold" }}>
            Tổng cộng: {(order.total + order.shippingFee).toLocaleString("vi-VN")}₫
          </p>
        </div>
      </div>
    </div>
  );
}
