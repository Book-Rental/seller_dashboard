import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createAuction,
    CreateAuctionPayload,
} from "../services/auctionService";

export const useCreateAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            payload: CreateAuctionPayload
        ) => createAuction(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auction-books"],
            });
        },
    });
};