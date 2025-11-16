// src/utils/productUtils.js
import { productData } from "./ProductData";

// Hàm tính khoảng giá theo product_id
export function getPriceRangeByProductId(productId) {
  // Lọc các variant có product_id khớp
  const variants = productData.product_variants.filter(
    (v) => v.product_id === productId
  );

  if (variants.length === 0) return null;

  // Lấy mảng giá
  const prices = variants.map((v) => v.price);

  // Tìm min, max
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return { minPrice, maxPrice };
}

// Hàm tính tổng tồn kho theo product_id
export function getStockByProductId(productId) {
  const variants = productData.product_variants.filter(
    (v) => v.product_id === productId
  );

  if (variants.length === 0) return 0;

  // Cộng dồn số lượng tồn kho
  return variants.reduce((total, v) => total + v.stock, 0);
}



export function getCategoryByProductId(productId) {
  // Tìm tất cả các liên kết trong bảng trung gian
  const productCategoryLinks = productData.product_categories.filter(
    (pc) => pc.product_id === productId
  );

  // Nếu sản phẩm không có danh mục
  if (productCategoryLinks.length === 0) return null;

  // Lấy tên các category tương ứng
  const categories = productCategoryLinks
    .map((pc) => {
      const category = productData.categories.find(
        (c) => c.id === pc.category_id
      );
      return category ? category.name : null;
    })
    .filter(Boolean); // loại bỏ giá trị null

  // Nếu có nhiều danh mục thì trả về mảng, còn 1 thì trả chuỗi
  return categories.length === 1 ? categories[0] : categories;
}


export function formatDateTime(date) {
  const d = new Date(date);

  return d
    .toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", " -");
}

export function getCustomerNameById(customerId) {
  const customer = productData.users.find((c) => c.id === customerId);
  return customer ? customer.name : "Khách lạ";
}
export function getCustomerPhoneById(customerId) {
  const customer = productData.users.find((c) => c.id === customerId);
  return customer ? customer.phone : "N/A";
}
export function getSubtotalByOrderId(orderId) {
  const orderItems = productData.order_items.filter(
    (item) => item.order_id === orderId
  );
  if (orderItems.length === 0) return 0;
  return orderItems.reduce((total, item) => total + item.subtotal, 0);
}
export function getPaymentMethodByOrderId(id) {
  const payment = productData.payments.find((p) => p.order_id === id);
  return payment ? payment.method : "N/A";
}

export function getOrderAddressByShipppingAddressId(id) {
  const adddress = productData.shipping_addresses.find((a) => a.id === id);
  return adddress
    ? `${adddress.address} - ${adddress.ward}/${adddress.district}/${adddress.city}`
    : "N/A";
}

export function getDataForOrderDetailItemsByOrderId(id) {
  // Lấy danh sách order_items của order đó
  const orderItems = productData.order_items.filter(
    (item) => item.order_id == id
  );

  // Với mỗi order_item, lấy danh sách variant chi tiết
   return orderItems.map((item) => {
    let itemVariants = [];
    let product = { name: "Unknown" }; // ✅ giá trị mặc định

    const variant = productData.product_variants.find(
      (pv) => pv.id == item.product_variants_id
    );

    if (variant) {
      product =
        productData.products.find((p) => p.id == variant.product_id) ||
        { name: "Unknown" };

      itemVariants = [
        {
          option_combination: variant.option_combination || {},
          skud : variant.sku || "",
          price: variant.price || 0,
          quantity: item.quantity || 0,
          subtotal: item.subtotal || 0,
        },
      ];
    }

    return {
      product_name: product.name,
      variants: itemVariants,
    };
  });
}

export function handleOptionCombination(option_combination) {
  if (!option_combination || typeof option_combination !== "object") return "";

  return Object.values(option_combination).join(",");
}
