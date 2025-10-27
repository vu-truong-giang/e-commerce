export const routeTree = {
  "/seller/dashboard": { label: "Trang chủ" },
  "/seller/products": { label: "Sản phẩm", parent: "/seller/dashboard" },
  "/seller/products/:id": { label: "Chi tiết sản phẩm", parent: "/seller/products" },
  "/seller/orders": { label: "Đơn hàng", parent: "/seller/dashboard" },
  "/seller/orders/:id": { label: "Chi tiết đơn hàng", parent: "/seller/orders" },
  "/seller/profile": { label: "Hồ sơ cá nhân", parent: "/seller/dashboard" },
};
