type CardStatusItemProps = {
    status: string;
}

const statusStyles: Record<string, string> = {
  "pending": "bg-warning ",
  "shipping": "bg-info ",
  "completed": "bg-success",
  "canceled": "bg-danger",
  "confirmed": "bg-primary",
};

export default function CardStatusItem({ status } : CardStatusItemProps) {
  // Lấy class theo trạng thái, nếu không có thì mặc định badge secondary
  const badgeClass = statusStyles[status.toLowerCase()] || "bg-secondary";

  return (
    <span className={`badge ${badgeClass} text-dark`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
