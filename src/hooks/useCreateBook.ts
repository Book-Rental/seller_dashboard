import { useMutation } from "@tanstack/react-query";
import { createBook } from "../services/bookService";

export const useCreateBook = () => {
    return useMutation({
        mutationFn: createBook,
    });
};