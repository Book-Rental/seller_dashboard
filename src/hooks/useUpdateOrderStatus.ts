import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../services/orderService";

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderItemId,
            action,
        }: {
            orderItemId: string;
            action: "approve" | "reject";
        }) =>
            updateOrderStatus(orderItemId, action),

        onSuccess: async (_, variables) => {
            await queryClient.refetchQueries({
                queryKey: ["order-details", variables.orderItemId],
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