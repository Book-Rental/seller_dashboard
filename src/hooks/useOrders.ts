import { useQuery } from "@tanstack/react-query";
import { getSellerOrders } from "../services/orderService";

export const useOrders = () => {
  return useQuery({
    queryKey: ["seller-orders"],
    queryFn: getSellerOrders,
  });
};