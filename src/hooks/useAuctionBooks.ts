import { useQuery } from "@tanstack/react-query";

import { getAuctionBooks } from "../services/auctionService";

export const useAuctionBooks = () => {
    return useQuery({
        queryKey: ["auction-books"],
        queryFn: getAuctionBooks,
    });
};