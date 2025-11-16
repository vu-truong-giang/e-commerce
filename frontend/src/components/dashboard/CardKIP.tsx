import { data } from "react-router-dom";
import CardKIPItem from "./CardKIPItem";

export default function CardKIP() {
  const data = {
    
  }
  return (
    <div className="row g-3 mb-4">
      <CardKIPItem
        icon="bi-currency-dollar"
        title="Doanh thu (30 ngày)"
        value="48,500,000"
        change="12%"
        changeType="increase"
      ></CardKIPItem>
      <CardKIPItem
        icon="bi-bag-fill"
        title="Đơn hàng hôm nay"
        value="152"
        change="12%"
        changeType="increase"
      ></CardKIPItem>
      <CardKIPItem
        icon="bi-box-seam"
        title="Sản phẩm tồn kho"
        value="48,500"
        change="12%"
        changeType="decrease"
      ></CardKIPItem>
      <CardKIPItem
        icon="bi-people-fill"
        title="Khách hàng mới"
        value="80"
        change="5%"
        changeType="increase"
      ></CardKIPItem>
      <CardKIPItem
        icon="bi-currency-dollar"
        title="Doanh thu (30 ngày)"
        value="48,500,000"
        change="12%"
        changeType="increase"
      ></CardKIPItem>
      <CardKIPItem
        icon="bi-currency-dollar"
        title="Doanh thu (30 ngày)"
        value="48,500,000"
        change="12%"
        changeType="increase"
      ></CardKIPItem>
    </div>
  );
}
