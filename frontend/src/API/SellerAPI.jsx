import API_BASE_URL from "../config/api";
import axios from "axios";

export const getSellerIdFromUserId = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/seller/by-user/${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch seller");
    }

    const data = await res.json();
    return data.seller_id;
  } catch (err) {
    console.error("Error getSellerId:", err);
    return null;
  }
};

export const checkEmailExists = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error("Failed to check email");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error checkEmailExists:", err);
    return false;
  }
};

export const loginUser = async (email, password) => {
  const controller = new AbortController();
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    if (!res.ok) {
      alert(data.detail || "Login failed");
      return;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error loginUser:", err);
    throw err;
  }
};

export const getUserInformation = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user information");
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error getUserInformation:", err);
    return null;
  }
};

export const createSeller = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/seller/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });

  return await response.json();
};

export const updateUserRoleToSeller = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/user/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    console.log("📌 API /user/:id/role response:", data);

    return data;
  } catch (err) {
    console.error("Error updateUserRole:", err);
    return { success: false };
  }
};


export const getOrderbySellerId = async (seller_id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/seller/${seller_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch orders by seller ID");
    }
    const data = await res.json();
    return data.orders;
  } catch (err) {
    console.error("Error getOrderbySellerId:", err);
    return [];
  }
}

export const getShipping_addressByShipping_addressId = async (shipping_address_id) => {
  try{
    const res = await fetch(`${API_BASE_URL}/shipping_address/${shipping_address_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch shipping address by ID");
    }
    const data = await res.json();
    return data.shipping_address;
  }catch (err) {
    console.error("Error getShipping_addressByShipping_addressId:", err);
    return null;
  }
}

export const getPaymentMethodByOrderId = async (order_id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/payment-method/order/${order_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch payment method by order ID");
    } 
    const data = await res.json();
    return data.payment_method;
  } catch (err) {
    console.error("Error getPaymentMethodByOrderId:", err);
    return null;
  }
}

export const getOrderDetailItemsByOrderId = async (order_id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/orderDetails/${order_id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch order detail items by order ID");
    } 
    const data = await res.json();
    return data.order_details;
  } catch (err) {
    console.error("Error getOrderDetailItemsByOrderId:", err);
    return [];
  }
}
/*=============================product api =============================*/

export const createProduct = async (productData) => {
  try {
    const normalized = {
      ...productData,
      // Convert options values to proper format: ["S", "M"] -> [{value: "S"}, {value: "M"}]
      options: productData.options.map(opt => ({
        name: opt.name,
        values: opt.values.map(v => typeof v === 'string' ? { value: v } : v)
      })),
      variants: productData.variants.map(v => ({
        option_combination: v.option_combination,
        price: parseFloat(v.price) || 0,
        stock: parseInt(v.stock) || 0,
        sku: v.sku || ""
      }))
    };
    
    console.log("📤 Normalized productData:", JSON.stringify(normalized, null, 2));
    
    const res = await axios.post(`${API_BASE_URL}/products/create`, normalized, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Backend response:", res.data);
    // Backend returns { message: "...", product_id: ... }
    return res.data.product_id || res.data;
  } catch (err) {
    console.error("Error createProduct status:", err.response?.status);
    console.error("Error createProduct detail:", err.response?.data?.detail);
    console.log("Detailed validation errors:");
    err.response?.data?.detail?.forEach((e, i) => {
      console.log(`Error ${i}:`, e.loc, "->", e.msg, "input:", e.input);
    });
    return null;
  }
}


/*=============================category api=============================*/

export const getAllCategories = async () => {
   try {
     const res = await axios.get(`${API_BASE_URL}/categories`);
     return res.data.categories;
   } catch (err) {
     console.error("Error getAllCategories:", err);
     return [];
   }
}

export const createCategory = async (payload) => {
  try { 
    const res = await axios.post(`${API_BASE_URL}/categories/create`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    // backend returns { message: ..., category: [...] }
    // Normalize to return the created category object (not an array)
    const created = res.data?.category;
    if (Array.isArray(created)) return created[0];
    return created;
  } catch (err) {
    console.error("Error createCategory:", err.response?.data || err);
    return null;
  }
}

export const deleteCategory = async (categoryId) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/categories/${categoryId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleteCategory:", err);
    return null;
  }
} 