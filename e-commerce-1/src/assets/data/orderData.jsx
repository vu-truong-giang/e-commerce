const ordersRaw = [
  {
    id: "ORD-2025-00130",
    date: new Date("2025-10-20T09:15:00"),
    customer: "Nguyễn Văn A",
    phone: "0901123456",
    address: "456 Đường ABC, Quận 2",
    status: "Chờ xác nhận",
    paymentMethod: "COD",
    shippingFee: 30000,
    items: [
      { name: "Áo sơ mi caro", qty: 1, price: 250000 },
      { name: "Quần kaki be", qty: 1, price: 400000 },
    ],
  },
  {
    id: "ORD-2025-00131",
    date: new Date("2025-10-21T14:30:00"),
    customer: "Trần Thị B",
    phone: "0902987654",
    address: "12 Nguyễn Văn Linh, Quận 7",
    status: "Đang giao",
    paymentMethod: "COD",
    shippingFee: 35000,
    items: [
      { name: "Váy hoa", qty: 2, price: 320000 },
      { name: "Giày sandal", qty: 1, price: 450000 },
    ],
  },
  {
    id: "ORD-2025-00132",
    date: new Date("2025-10-22T10:00:00"),
    customer: "Phạm Minh C",
    phone: "0912345678",
    address: "89 Lê Lợi, Quận 1",
    status: "Đã giao",
    paymentMethod: "Chuyển khoản",
    shippingFee: 25000,
    items: [
      { name: "Áo hoodie trắng", qty: 1, price: 550000 },
      { name: "Mũ lưỡi trai", qty: 2, price: 120000 },
    ],
  },
  {
    id: "ORD-2025-00133",
    date: new Date("2025-10-23T16:45:00"),
    customer: "Lê Thị D",
    phone: "0903123123",
    address: "22 Trần Hưng Đạo, Quận 5",
    status: "Đã hủy",
    paymentMethod: "COD",
    shippingFee: 0,
    items: [
      { name: "Đầm maxi", qty: 1, price: 480000 },
    ],
  },
  {
    id: "ORD-2025-00134",
    date: new Date("2025-10-23T18:20:00"),
    customer: "Đỗ Văn E",
    phone: "0934123123",
    address: "101 Nguyễn Trãi, Quận 10",
    status: "Chờ xác nhận",
    paymentMethod: "Chuyển khoản",
    shippingFee: 30000,
    items: [
      { name: "Áo thun basic", qty: 3, price: 150000 },
      { name: "Quần short jean", qty: 1, price: 280000 },
    ],
  },
];

const orders = ordersRaw.map(order => {
  // tạo mảng items có thêm totalItem cho mỗi item
  const itemsWithTotal = order.items.map(item => ({
    ...item,
    totalItem: item.price * item.qty
  }));

  // tính tổng tất cả totalItem
  const total = itemsWithTotal.reduce((sum, item) => sum + item.totalItem, 0);

  return {
    ...order,
    items: itemsWithTotal, // cập nhật lại items
    total
  };
});




console.log(orders);
export { orders };


