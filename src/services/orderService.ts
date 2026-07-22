import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSellerOrders = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/order/seller/orders`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};