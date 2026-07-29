import { useQuery } from "@tanstack/react-query";
import { getOrderDetails } from "../services/orderService";

export const useOrderDetails = (orderItemId: string) => {
    return useQuery({
        queryKey: ["order-details", orderItemId],
        queryFn: () => getOrderDetails(orderItemId),
        enabled: !!orderItemId,
    });
};