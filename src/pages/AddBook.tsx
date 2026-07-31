import {
    Rb_LoadingSpinner,
    Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import BookForm from "../components/BookForm";
import { useBookById } from "../hooks/useBookById";
import SellerLayout from "../components/SellerLayout";


type AddBookProps = {
    mode?: "create" | "edit";
    bookId?: string;
};

const AddBook = ({
    mode = "create",
    bookId,
}: AddBookProps) => {
    const { data, isLoading, isError, error } = useBookById(bookId ?? "");

    if (mode === "edit") {
        if (isLoading) {
            return (
                <SellerLayout currentPage="seller-add-book">
                    <div className="flex min-h-[24rem] items-center justify-center px-4">
                        <Rb_LoadingSpinner />
                    </div>
                </SellerLayout>
            );
        }

        if (isError) {
            return (
                <SellerLayout currentPage="seller-add-book">
                    <div className="flex min-h-[24rem] items-center justify-center px-4 text-center">
                        <Rb_Text className="max-w-md break-words">
                            {error instanceof Error ? error.message : "Failed to load book"}
                        </Rb_Text>
                    </div>
                </SellerLayout>
            );
        }

        return (
            <SellerLayout currentPage="seller-add-book">
                <BookForm mode="edit" bookId={bookId} initialData={data?.data} />
            </SellerLayout>
        );
    }

    return (
        <SellerLayout currentPage="seller-add-book">
            <BookForm mode="create" />
        </SellerLayout>
    );
};
export default AddBook;