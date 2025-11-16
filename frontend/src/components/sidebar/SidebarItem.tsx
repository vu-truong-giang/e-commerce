import { Outlet, NavLink } from "react-router-dom";


type SidebarItemProps = {
  label: string;
  tooltip: string;
  icon: string;
  href: string;
  onLinkClick: (tooltip: string) => void; // định nghĩa kiểu
};


export default function SidebarItem({ label, tooltip, icon ,onLinkClick, href }: SidebarItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onLinkClick(tooltip); 
  };
  
  return (
    <li className="nav-item">
      <NavLink to ={href}
        className="nav-link"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-trigger="hover"
        title={tooltip}
        onClick={handleClick}
      >
        <i className={`bi ${icon}`}></i>
        <span className="fade-out">{label}</span>
      </NavLink>
    </li>
  );
}
