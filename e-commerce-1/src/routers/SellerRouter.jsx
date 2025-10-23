// src/routers/SellerRouter.jsx
import { Route } from "react-router-dom";
import SellerLayout from "../layouts/LayoutSeller";
import Dashboard from "../pages/seller/Dashboard";
import Orders from "../pages/seller/orders/Orders";
import Products from "../pages/seller/products/Products";
import Report from "../pages/seller/Report";
import Revenue from "../pages/seller/Revenue";
import Settings from "../pages/seller/Settings";
import OrderDetail from "../pages/seller/orders/OrderDetail";

export const SellerRouter = (
  <Route path="/seller" element={<SellerLayout />}>
    <Route index element={<Dashboard />} /> 
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetail />} /> 
    <Route path="products" element={<Products />} />
    <Route path="report" element={<Report />} />
    <Route path="revenue" element={<Revenue />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);
