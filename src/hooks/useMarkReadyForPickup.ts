// hooks/useMarkReadyForPickup.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markReadyForPickup } from "../services/shipmentService";

export const useMarkReadyForPickup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderItemId: string) => markReadyForPickup(orderItemId),

        onSuccess: async (_, orderItemId) => {
            await queryClient.refetchQueries({
                queryKey: ["order-details", orderItemId],
                type: "active",
            });

            await queryClient.refetchQueries({
                queryKey: ["orders"],
                type: "active",
            });

            await queryClient.refetchQueries({
                queryKey: ["recent-orders"],
                type: "active",
            });
        },
    });
};