const productData = {
  users: [
     {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    password: "$2b$10$hash123abc...",
    phone: "0905123456",
    avatar: "https://i.pravatar.cc/150?img=1",
    role: "buyer",
    status: "active",
    last_login: "2025-10-24T10:15:00Z",
    created_at: "2025-10-01T09:00:00Z",
    updated_at: "2025-10-24T10:15:00Z",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    password: "$2b$10$hash456def...",
    phone: "0912345678",
    avatar: "https://i.pravatar.cc/150?img=2",
    role: "buyer",
    status: "active",
    last_login: "2025-10-20T08:45:00Z",
    created_at: "2025-10-02T11:00:00Z",
    updated_at: "2025-10-20T08:45:00Z",
  },

  ],
  sellers: [
    {
      id: 1,
      user_id: 5,
      shop_name: "Giang Store",
      address: "123 Nguyễn Huệ, TP.HCM",
      phone: "0909123456",
    },
  ],

  products: [
    {
      id: 1,
      shop_id: 1,
      name: "Áo thun nam cổ tròn",
      description: "Áo thun cotton 100%, co giãn 4 chiều, thoáng mát.",
      
      images: ["shirt1.jpg", "shirt2.jpg"],
      created_at: "2025-10-26T10:00:00Z",
    },
    {
      id: 2,
      shop_id: 1,
      name: "Quần jean nam ống suông",
      description: "Chất liệu denim cao cấp, co giãn nhẹ.",
      images: ["jean1.jpg", "jean2.jpg"],
      created_at: "2025-10-26T11:00:00Z",
    },
  ],

  categorys: [
    { id: 1, product_id: 1 , name: "Áo thun" },
    { id: 2, product_id: 2 , name: "Quần jean" },
  ],

  product_options: [
    { id: 1, product_id: 1, name: "Màu sắc" },
    { id: 2, product_id: 1, name: "Kích cỡ" },
    { id: 3, product_id: 2, name: "Kích cỡ" },
  ],

  product_option_values: [
    { id: 1, option_id: 1, value: "Đen" },
    { id: 2, option_id: 1, value: "Trắng" },
    { id: 3, option_id: 2, value: "M" },
    { id: 4, option_id: 2, value: "L" },
    { id: 5, option_id: 3, value: "32" },
    { id: 6, option_id: 3, value: "34" },
  ],

  product_variants: [
    {
      id: 1,
      product_id: 1,
      sku: "TS-BLACK-M",
      price: 199000,
      stock: 50,
      option_combination: { "Màu sắc": "Đen", "Kích cỡ": "M" },
    },
    {
      id: 2,
      product_id: 1,
      sku: "TS-WHITE-L",
      price: 2000000,
      stock: 40,
      option_combination: { "Màu sắc": "Trắng", "Kích cỡ": "L" },
    },
    {
      id: 3,
      product_id: 2,
      sku: "JEAN-32",
      price: 399000,
      stock: 30,
      option_combination: { "Kích cỡ": "32" },
    },
    {
      id: 4,
      product_id: 2,
      sku: "JEAN-34",
      price: 399000,
      stock: 25,
      option_combination: { "Kích cỡ": "34" },
    },
  ],
  shipping_addresses: [
    {
      id: 1,
      user_id: 1,
      receiver_name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Nguyễn Trãi",
      city: "Hà Nội",
      district: "Thanh Xuân",
      ward: "Thượng Đình",
      postal_code: "100000",
    },
    {
      id: 2,
      user_id: 2,
      receiver_name: "Trần Thị B",
      phone: "0907654321",
      address: "45 Lê Lợi",
      city: "Hồ Chí Minh",
      district: "Quận 1",
      ward: "Bến Nghé",
      postal_code: "700000",
    },
  ],

   orders: [
    {
      id: 1,
      user_id: 1,
      seller_id: 1,
      order_code: "ORD-2025-0001",
      total_amount: 698000,
      shipping_addresses_id: 1,
      shipping_fee: 30000,
      status: "pending",
      note: "Giao giờ hành chính",
      created_at: "2025-10-25T09:30:00Z",
      updated_at: "2025-10-25T09:30:00Z",
    },
    {
      id: 2,
      user_id: 2,
      seller_id: 2,
      order_code: "ORD-2025-0002",
      total_amount: 1298000,
      shipping_addresses_id: 2,
      shipping_fee: 40000,
      status: "canceled",
      note: "",
      created_at: "2025-10-24T13:15:00Z",
      updated_at: "2025-10-24T15:00:00Z",
    },
  ],

  order_items: [
    {
      id: 1,
      order_id: 1,
      product_variants_id: 1,
      quantity: 2,
      price: 199000,
      subtotal: 398000,
    },
    {
      id: 2,
      order_id: 1,
      product_variants_id: 2,
      quantity: 1,
      price: 300000,
      subtotal: 300000,
    },
    {
      id: 3,
      order_id: 2,
      product_variants_id: 3,
      quantity: 1,
      price: 499000,
      subtotal: 499000,
    },
    {
      id: 4,
      order_id: 2,
      product_variants_id: 4,
      quantity: 2,
      price: 399000,
      subtotal: 798000,
    },
  ],

  payments: [
    {
      id: 1,
      order_id: 1,
      method: "COD",
      amount: 728000,
      status: "pending",
      transaction_code: null,
      paid_at: null,
    },
    {
      id: 2,
      order_id: 2,
      method: "BankTransfer",
      amount: 1338000,
      status: "paid",
      transaction_code: "PAYBANK123456",
      paid_at: "2025-10-24T13:20:00Z",
    },
  ],
};

const statusPriority = {
    "pending": 1,
    "confirmed": 2,
    "shipping": 3,
    "canceled": 4,
    "completed": 5,
  };
export default productData;
export { productData , statusPriority };