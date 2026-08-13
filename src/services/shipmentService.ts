import axios from "axios";

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;

export const markReadyForPickup = async (shipmentId: string) => {
  const response = await axios.patch(
    `${ADMIN_URL}/api/shipment/order-item/${shipmentId}/ready-for-pickup`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};