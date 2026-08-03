// services/shipmentService.ts
import axios from "axios";

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL; // or wherever adminUrl comes from

export const markReadyForPickup = async (orderItemId: string) => {
  const response = await axios.patch(
    `${ADMIN_URL}/api/shipment/order-item/${orderItemId}/ready-for-pickup`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};