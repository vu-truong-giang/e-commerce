// src/routers/SellerRouter.jsx
import { Route } from "react-router-dom";
import SellerLayout from "../layouts/LayoutSeller";
import Dashboard from "../pages/seller/Dashboard";
import Orders from "../pages/seller/Orders";
import Products from "../pages/seller/Products";
import Report from "../pages/seller/Report";
import Revenue from "../pages/seller/Revenue";
import Settings from "../pages/seller/Settings";

export const SellerRouter = (
  <Route path="/seller" element={<SellerLayout />}>
    <Route index element={<Dashboard />} /> 
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="orders" element={<Orders />} />
    <Route path="products" element={<Products />} />
    <Route path="report" element={<Report />} />
    <Route path="revenue" element={<Revenue />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);
