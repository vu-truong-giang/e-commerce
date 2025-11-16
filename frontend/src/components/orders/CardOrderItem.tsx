import { Link } from "react-router-dom";
import CardStatusItem from "./CardStatusItem";
import { formatDateTime } from "../../assets/data/FunctionData";
type CardOrderItemProps = {
  id: number;
  date: string ;
  customer: string;
  phone: string;
  total: number;
  status: string;
  paymentMethod: string;
};


export default function CardOrderItem({
  id,
  date,
  customer,
  phone,
  total,
  status,
  paymentMethod,
}: CardOrderItemProps) {
  return (
    <tr>
      <td>{id}</td>
      <td>{formatDateTime(date)}</td>
      <td>
        {customer} - {phone}
      </td>
      <td>{total.toLocaleString("vi-VN")}đ</td>
      <td>
        <CardStatusItem status={status} />
      </td>
      <td>{paymentMethod}</td>
      <td>
        <Link
          to={`/seller/orders/orderDetail/${id}`}
          className="btn btn-sm btn-outline-primary text-decoration-none"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}
