import { useQuery } from "@tanstack/react-query";
import { getShipmentDetails } from "../services/orderService";

export const useShipmentDetails = (
    orderItemId: string
) => {
    return useQuery({
        queryKey: ["shipment", orderItemId],
        queryFn: () =>
            getShipmentDetails(orderItemId),
        enabled: !!orderItemId,
    });
};