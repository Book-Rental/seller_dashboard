import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getSellerDashboard = async () => {
  
  const response = await axios.get(
    `${BASE_URL}/api/order/seller/dashboard`,
    {
      withCredentials:true,
    }
  );
  return response.data;

};