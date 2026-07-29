import {
    Rb_LoadingSpinner,
    Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import BookForm from "../components/BookForm";
import { useBookById } from "../hooks/useBookById";

type AddBookProps = {
    mode?: "create" | "edit";
    bookId?: string;
};

const AddBook = ({
    mode = "create",
    bookId,
}: AddBookProps) => {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useBookById(bookId ?? "");

    if (mode === "edit") {
        if (isLoading) {
            return (
                <div className="flex min-h-[24rem] items-center justify-center px-4">
                    <Rb_LoadingSpinner />
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex min-h-[24rem] items-center justify-center px-4 text-center">
                    <Rb_Text className="max-w-md break-words">
                        {error instanceof Error
                            ? error.message
                            : "Failed to load book"}
                    </Rb_Text>
                </div>
            );
        }

        return (
            <BookForm
                mode="edit"
                bookId={bookId}
                initialData={data?.data}
            />
        );
    }

    return <BookForm mode="create" />;
};

export default AddBook;