import React, { useEffect, useState} from "react";
import { Outlet, NavLink } from "react-router-dom";
import * as bootstrap from "bootstrap";  
import { useParams } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../assets/css/LayoutSeller.css"
import logo from "../assets/images/img_logo_light.png";


import Sidebar from "../components/sidebar/Sidebar";

export default function LayoutSeller() {
  const { sellerid } = useParams();
  console.log("Seller ID in LayoutSeller:", sellerid);
  const [collapsed, setCollapsed] = useState(false);
  const [title , setTitle] = useState("Header");
  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  [...tooltipTriggerList].forEach(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}, [collapsed]);

  
  return (
    <div className="container-fluid d-flex p-0 h-100">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`sidebar flex-shrink-0 d-flex flex-column text-white ${
          collapsed ? "collapsed" : ""
        }`}
        style={{
          width: "var(--sidebar-w)",
          background: "linear-gradient(45deg, var(--grad-a), var(--grad-b))",
          transition: "width 0.3s",
        }}
      >
        <div className="sidebar_logo p-3 border-bottom d-flex align-items-center">
          <div
            className="rounded-1 overflow-hidden"
            style={{ width: "40px", height: "40px", backgroundColor: "white" }}
          >
            <img
              src={logo}
              alt=""
              className="w-100 h-100 object-fit-contain"
              style={{ transform: "scale(1.5)" }}
            />
          </div>

          <div className="ms-2 fs-4 fw-bold align-items-start justify-content-center text-dark d-flex flex-column fade-out">
            <span className="text-white" style={{ fontSize: "medium" }}>
              Seller
            </span>
            <span className="nowrap" style={{ fontSize: "xx-small", color: "whitesmoke" }}>
              be your best choice..
            </span>
          </div>
        </div>
        <Sidebar onLinkClick={setTitle} />
      </div>

      {/* Content */}
      <div
        id="content"
        className="content flex-fill d-flex flex-column"
        style={{ transition: "margin-left 0.3s" }}
      >
        {/* Header content */}
        <div className="content_header p-2 d-flex">
          <button
            id="toggleBtn"
            className="btn btn-navbar btn-secondary"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
          <h2 className="ps-2 pe-2 m-0">{title}</h2>
          <form className="d-flex ms-auto" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>

        {/* Main content */}
        <div
          className="content_main p-3 overflow-auto"
          style={{ height: "calc(100vh - 56px)" }}
        >
          <Outlet context={{ seller_id: sellerid }}/>
        </div>
      </div>
    </div>
  );
}
