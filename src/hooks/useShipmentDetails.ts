import { useQuery } from "@tanstack/react-query";
import { getShipmentDetails } from "../services/orderService";

export const useShipmentDetails = (
    orderItemId: string,
    options = {}
) => {
    return useQuery({
        queryKey: ["shipment", orderItemId],
        queryFn: () =>
            getShipmentDetails(orderItemId),
        ...options,

    });
};