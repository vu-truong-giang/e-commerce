type CardStatusItemProps = {
    status: string;
}

const statusStyles: Record<string, string> = {
  "chờ xác nhận": "bg-warning text-dark",
  "đang giao": "bg-info text-dark",
  "hoàn tất": "bg-success",
  "đã hủy": "bg-danger",
};

export default function CardStatusItem({ status } : CardStatusItemProps) {
  // Lấy class theo trạng thái, nếu không có thì mặc định badge secondary
  const badgeClass = statusStyles[status.toLowerCase()] || "bg-secondary";

  return (
    <span className={`badge ${badgeClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
