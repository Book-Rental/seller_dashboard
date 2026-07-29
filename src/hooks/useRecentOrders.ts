import { useQuery } from "@tanstack/react-query";
import { getRecentOrders } from "../services/orderService";

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
  });
};