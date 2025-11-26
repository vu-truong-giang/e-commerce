import { use } from "react";
import SiderbarItem from "./SidebarItem";
import { useParams } from "react-router-dom";

type SidebarProps = {
  onLinkClick: (tooltip: string) => void;
};

export default function Sidebar({onLinkClick}: SidebarProps) {
  const { sellerid } = useParams();
  console.log("Seller ID in Sidebar:", sellerid);
  return (
    <ul className="nav d-flex flex-column mt-4 ps-2 list-unstyled">
       <SiderbarItem label="Dashboard" tooltip="Trang tổng quan" icon="bi-speedometer2" onLinkClick={onLinkClick} href={`dashboard`} ></SiderbarItem>
       <SiderbarItem label="Orders" tooltip="Quản lý đơn hàng" icon="bi-receipt" onLinkClick={onLinkClick} href={`orders`}></SiderbarItem>
       <SiderbarItem label="Products" tooltip="Quản lý sản phẩm" icon="bi-box-seam" onLinkClick={onLinkClick} href={`products`}></SiderbarItem>
       <SiderbarItem label="Revenue" tooltip="Quản lý doanh thu" icon="bi-bar-chart-line" onLinkClick={onLinkClick} href="revenue"></SiderbarItem>
       <SiderbarItem label="Reports" tooltip="Quản lý đánh giá" icon="bi-card-text" onLinkClick={onLinkClick} href="report"></SiderbarItem>
       <SiderbarItem label="Settings" tooltip="Cài đặt tài khoản" icon="bi-gear" onLinkClick={onLinkClick} href="settings"></SiderbarItem>
       <SiderbarItem label="Logout" tooltip="Thoát" icon="bi-arrow-left-square" onLinkClick={onLinkClick} href="/login"></SiderbarItem>
    </ul>
  );
}
