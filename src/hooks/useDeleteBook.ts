import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "../services/bookService";

export const useDeleteBook = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBook,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["seller-books"],
            });
        },
    });
};