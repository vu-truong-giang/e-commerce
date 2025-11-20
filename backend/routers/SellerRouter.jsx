// src/routers/SellerRouter.jsx
import { Route } from "react-router-dom";
import SellerLayout from "../../frontend/src/layouts/LayoutSeller";
import Dashboard from "../../frontend/src/pages/seller/Dashboard";
import Orders from "../../frontend/src/pages/seller/orders/Orders";
import Products from "../../frontend/src/pages/seller/products/Products";
import Report from "../../frontend/src/pages/seller/Report";
import Revenue from "../../frontend/src/pages/seller/Revenue";
import Settings from "../../frontend/src/pages/seller/Settings";
import OrderDetail from "../../frontend/src/pages/seller/orders/OrderDetail";
import ProductDetail from "../../frontend/src/pages/seller/products/ProductDetail";
import CategoryManager from "../../frontend/src/pages/seller/categories/categories";
export const SellerRouter = (
  <Route path="/seller" element={<SellerLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard/:sellerID" element={<Dashboard />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/orderDetail/:id" element={<OrderDetail />} />
    <Route path="products" element={<Products />} />
    <Route path="products/productDetail/:id" element={<ProductDetail />} />
    <Route path="products/new" element={<ProductDetail />} />
    <Route path="products/category" element={<CategoryManager />} />
    <Route path="report" element={<Report />} />
    <Route path="revenue" element={<Revenue />} />
    <Route path="settings" element={<Settings />} />
  </Route>
);