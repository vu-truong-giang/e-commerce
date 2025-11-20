import API_BASE_URL from "../config/api";

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