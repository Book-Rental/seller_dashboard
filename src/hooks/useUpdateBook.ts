import { useMutation } from "@tanstack/react-query";
import { updateBook } from "../services/bookService";

export const useUpdateBook = () => {
    return useMutation({
        mutationFn: updateBook,
    });
};