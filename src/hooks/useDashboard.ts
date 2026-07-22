import { useQuery } from "@tanstack/react-query";
import { getSellerDashboard } from "../services/dashboardService";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: getSellerDashboard,
  });
};