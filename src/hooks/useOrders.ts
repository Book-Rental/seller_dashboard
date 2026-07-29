import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services/orderService";

export const useOrders = (
    page: number
) => {
    return useQuery({
        queryKey: ["orders", page],
        queryFn: () => getOrders(page),
    });
};