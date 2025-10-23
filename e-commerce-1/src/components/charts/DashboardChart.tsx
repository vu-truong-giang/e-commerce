import LineChart_Revenue from "./LineChart_Revenue";
import PieChart_OrderRate from "./PieChart_OrderRate";
import BarChart_TopProducts from "./BarChart_TopProducts";

export default function DashboardChart() {
  return (
    <div className="row g-3 mt-3">
      <div className="col-lg-6">
        <LineChart_Revenue />
      </div>
      <div className="col-lg-6">
        <PieChart_OrderRate />
      </div>
      <div className="col-12">
        <BarChart_TopProducts />
      </div>
    </div>
  );
}
