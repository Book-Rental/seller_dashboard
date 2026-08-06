import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadyForPickup } from "../services/shipmentService";

export const useMarkReadyForPickup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderItemId: string) =>
            markReadyForPickup(orderItemId),

        onSuccess: (_, orderItemId) => {
            queryClient.invalidateQueries({
                queryKey: ["shipment", orderItemId],
            });

            queryClient.invalidateQueries({
                queryKey: ["order-details", orderItemId],
            });

            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });

            queryClient.invalidateQueries({
                queryKey: ["recent-orders"],
            });
        },
    });
};