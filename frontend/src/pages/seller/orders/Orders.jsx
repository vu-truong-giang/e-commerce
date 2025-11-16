import React, { useState, useEffect , useMemo } from "react";
import CardOrderItem from "../../../components/orders/CardOrderItem";
import "../../../assets/css/OrderManagement.css";
import productData  , { statusPriority } from "../../../assets/data/ProductData";
import { getCustomerNameById, getCustomerPhoneById, getPaymentMethodByOrderId, getSubtotalByOrderId } from "../../../assets/data/FunctionData";

export default function Orders() {

  const sortedOrders = useMemo(() => {
  return [...productData.orders].sort((a, b) => {
    const statusA = statusPriority[a.status] || 99;
    const statusB = statusPriority[b.status] || 99;
    if(statusA !== statusB) {
      return statusA - statusB;
    }
    return new Date(b.date) - new Date(a.date);
  });
}, [productData.orders]);
  
  
  const [searchId , setSearchId] = useState("");
  const [filterStatus , setFilterStatus] = useState("");
  const [filterDate , setFilterDate] = useState("");
  const [filterPayment , setFilterPayment] = useState("");
  const [filterOrders, setFilterOrders] = useState(productData.orders);

  useEffect(() => {
    let filtered = sortedOrders;

    if (searchId !== ""){
      filtered = filtered.filter(order => order.id.toLowerCase().includes(searchId.toLowerCase()));
    }

    if (filterStatus !== ""){
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    if (filterPayment !== ""){
      filtered = filtered.filter(order => order.paymentMethod === filterPayment);
    }

    if (filterDate !== ""){
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === filterDate;
      })
    }
    setFilterOrders(filtered)
  }, [searchId, filterStatus, filterDate, filterPayment, sortedOrders]);

  // ====== RESET FILTER ======
  const resetFilters = () => {
    setSearchId("");
    setFilterStatus("");
    setFilterDate("");
    setFilterPayment("");
  };

  return (
    <div>
      <h2 className="order-header mb-4">Đơn hàng</h2>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="filter-bar bg-white rounded-3 shadow-sm p-3 mb-4">
        <form className="row g-3 align-items-center">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm mã đơn hàng..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>Trạng thái đơn hàng</option>
              <option>Chờ xác nhận</option>
              <option>Đang giao</option>
              <option>Hoàn tất</option>
              <option>Đã hủy</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
              <option>Phương thức thanh toán</option>
              <option>COD</option>
              <option>Chuyển khoản</option>
            </select>
          </div>
          <div className="col-md-1">
            <button type="button" className="btn btn-primary w-100" onClick={resetFilters}> 
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Bảng danh sách đơn hàng */}
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
            
              {filterOrders.length > 0 ? (
              filterOrders.map(order => (
                <CardOrderItem key={order.id}
                 id={order.id} 
                 date={order.created_at} 
                 customer={getCustomerNameById(order.user_id)} 
                 phone={getCustomerPhoneById(order.user_id)} 
                 total={getSubtotalByOrderId(order.id)}
                 status={order.status}
                 paymentMenthod={getPaymentMethodByOrderId(order.id)} />
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
