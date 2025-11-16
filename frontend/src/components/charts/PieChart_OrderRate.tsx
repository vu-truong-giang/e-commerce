import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Chờ xử lý", value: 15 },
  { name: "Đang giao", value: 30 },
  { name: "Đã giao", value: 45 },
  { name: "Đã hủy", value: 10 },
];

const COLORS = ["#ffc107", "#0d6efd", "#198754", "#dc3545"];

export default function PieChart_OrderRate() {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="fw-bold mb-3">📊 Tỷ lệ đơn hàng theo trạng thái</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
