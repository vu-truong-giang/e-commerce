import React from "react";
import CardKIP from "../../components/dashboard/CardKIP";
import DashboardChart from "../../components/charts/DashboardChart";

export default function Dashboard() {
  return (
    <div className="content_main flex-grow-1 p-3 overflow-auto">
      <CardKIP></CardKIP>

      <DashboardChart></DashboardChart>
    </div>
  );
}
