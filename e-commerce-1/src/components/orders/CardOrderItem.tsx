import React from "react";
import { Link } from "react-router-dom";
import CardStatusItem from "./CardStatusItem";
         
type CardOrderItemProps = {
  id: string;
  date: string | Date;
  customer: string;
  phone: string;
  total: number;
  status: string;
  paymentMethod: string;
};

function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  return d
    .toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", " -");
}

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
        <button className="btn btn-sm btn-primary">
          <Link to={`/seller/orders/${id}`} className="text-white text-decoration-none">Chi tiết</Link> 
        </button>
      </td>
    </tr>
  );
}
