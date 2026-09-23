import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelAuction } from "../services/auctionService";

export const useCancelAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (auctionId: string) =>
            cancelAuction(auctionId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["seller-books"],
            });
        },
    });
};