// src/routers/AppRouter.jsx
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import { SellerRouter } from "./SellerRouter";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/seller" replace />} />

        
        {/* Import route Seller */}
        {SellerRouter}

        {/* Có thể thêm route cho Buyer, Admin ở đây */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}
