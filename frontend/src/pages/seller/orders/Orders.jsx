import React, { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CardOrderItem from "../../../components/orders/CardOrderItem";
import { statusPriority } from "../../../assets/data/ProductData";

import "../../../assets/css/OrderManagement.css";
import { getOrderDetailItemsByOrderId , getOrderbySellerId } from "../../../API/SellerAPI";

export default function Orders() {
  const { seller_id } = useOutletContext();
  console.log("Seller ID in Orders component:", seller_id); // 3

  const [ordersList, setOrdersList] = useState([]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      const order = await getOrderbySellerId(seller_id);

      // Load shipping + payment cho từng order
      const ordersWithDetails = order.map( async (ord) => {
         const orders = await getOrderDetailItemsByOrderId(ord.id)
         return orders;
      })

      setOrdersList(ordersWithDetails);
    }

    fetchOrders();
  }, [seller_id]);

  const sortedOrders = useMemo(() => {
    return [...ordersList].sort((a, b) => {
      const statusA = statusPriority[a.status] || 99;
      const statusB = statusPriority[b.status] || 99;

      if (statusA !== statusB) return statusA - statusB;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [ordersList]);

  return (
    <div>
      <h2 className="order-header mb-4">Đơn hàng</h2>

      <div className="table-responsive">
        <table className="table table-hover align-middle bg-white rounded-3 shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length > 0 ? (
              sortedOrders.map(order => (
                <CardOrderItem
                  key={order.id}
                  id={order.id}
                  date={order.created_at}
                  customer={order.shipping?.receiver_name}
                  phone={order.shipping?.phone}
                  total={order.total_amount}
                  status={order.status}
                  paymentMenthod={order.payment?.status}
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3">
                  Không có đơn hàng nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
