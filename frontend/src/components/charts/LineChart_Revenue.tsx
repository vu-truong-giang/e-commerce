import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
    {name: 'T2', revenue: 1000000},
    {name: 'T3', revenue: 3000000},
    {name: 'T4', revenue: 2000000},
    {name: 'T5', revenue: 2780000},
    {name: 'T6', revenue: 1890000},
    {name: 'T7', revenue: 2390000},
    {name: 'CN', revenue: 349000}
];

export default function LineChart_Revenue(){
    return(
        <div className="card p-3 shadow-sm">
      <h5 className="fw-bold mb-3">📈 Doanh thu theo ngày</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v) => v / 1000000 + "M"} />
          <Tooltip formatter={(v) => v.toLocaleString("vi-VN") + " ₫"} />
          <Line type="monotone" dataKey="revenue" stroke="#007bff" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    );
}

