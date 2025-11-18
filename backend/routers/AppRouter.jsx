// src/routers/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SellerRouter } from "./SellerRouter";
import LoginPage from "../../frontend/src/pages/seller/login/login.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Route Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Import route Seller */}
        {SellerRouter}

        {/* Có thể thêm route cho Buyer, Admin ở đây */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
