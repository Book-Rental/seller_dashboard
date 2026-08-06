import { useQuery } from "@tanstack/react-query";
import { getSellerBooks } from "../services/bookService";

export const useSellerBooks = (
    sellerId: string,
    page: number,
    categoryName: string
) => {
    
    return useQuery({
        queryKey: [
            "seller-books",
            sellerId,
            page,
            categoryName,
        ],
        queryFn: () =>
            getSellerBooks(
                sellerId,
                page,
                10,
                categoryName
            ),
        enabled: !!sellerId,
    });
};