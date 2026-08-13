import { useQuery } from "@tanstack/react-query";
import { getShipmentDetails } from "../services/orderService";

export const useShipmentDetails = (
    awbNumber: string,
    options = {}
) => {
    return useQuery({
        queryKey: ["shipment", awbNumber],
        queryFn: () =>
            getShipmentDetails(awbNumber),
        ...options,

    });
};