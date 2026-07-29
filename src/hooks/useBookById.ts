import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../services/bookService";

export const useBookById = (bookId: string) => {
    return useQuery({
        queryKey: ["book", bookId],
        queryFn: () => getBookById(bookId),
        enabled: !!bookId,
    });
};