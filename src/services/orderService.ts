import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL

export const getOrders = async ( page=1,limit = 10) => {
    const response = await axios.get(
        `${API_URL}/api/order/seller/orders?page=${page}&limit=${limit}`,
        {
            withCredentials: true,
        }
    );

    return response.data;
};

export const getRecentOrders = async () => {
  const response = await fetch(
    `${API_URL}/api/order/seller/recent-orders`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent orders");
  }

  return response.json();
};

export const getOrderDetails = async (
  orderItemId: string
) => {
  const response = await fetch(
    `${API_URL}/api/order/seller/order-item/${orderItemId}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order details");
  }

  return response.json();
};

export const updateOrderStatus = async (
  orderItemId: string,
  action: "approve" | "reject"
) => {
  const response = await fetch(
    `${API_URL}/api/order/seller/order-item/${orderItemId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  return response.json();
};

export const getShipmentDetails = async (
    orderItemId: string
) => {
    const response = await fetch(
        `${ADMIN_URL}/api/shipment/order-item/${orderItemId}`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch shipment");
    }

    return response.json();
};