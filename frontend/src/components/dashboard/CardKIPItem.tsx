type CardKIPItemProps = {
  icon: string;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
};

export default function CardKIPItem({
  icon,
  title,
  value,
  change,
  changeType,
}: CardKIPItemProps) {

  const changeColor = changeType === "increase" ? "text-success" : "text-danger";
  const changeIcon = changeType === "increase" ? "bi bi-arrow-up" : "bi bi-arrow-down";

  return (
    <div className="col-md-6 col-lg-4  ">
      <div className="card">
        <div className="card-body d-flex align-items-center">
          <div className="me-3 p-3 bg-light rounded-3">
            <i className={`bi ${icon} text-success`}></i>
          </div>
          <div className="text-nowrap">
            <div className="text-muted small ">{title}</div>
            <div className="h5 mb-0">{value}</div>
            <small className={`text-success ${changeColor}`}>
              <i className={`${changeIcon} me-1`}></i>
              {change} so với trước
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
