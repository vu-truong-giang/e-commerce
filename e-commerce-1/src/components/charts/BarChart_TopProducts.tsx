import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Áo thun", sales: 450 , revenue: 9000000},
  { name: "Giày sneaker", sales: 380 , revenue: 15200000},
  { name: "Túi xách", sales: 310 , revenue: 12400000},
  { name: "Mũ lưỡi trai", sales: 270 , revenue: 5400000},
  { name: "Quần jean", sales: 220 , revenue: 11000000},
];

export default function BarChart_TopProducts() {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="fw-bold mb-3">🔥 Top 5 sản phẩm bán chạy nhất</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barCategoryGap={15} barGap={5}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(v, name) =>
              name === "sales"
                ? `${v} sản phẩm`
                : v.toLocaleString("vi-VN") + " ₫"
            }
          />
          <Bar dataKey="sales" fill="#0d6efd" name="Số lượng bán" />
          <Bar dataKey="revenue" fill="#198754" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
