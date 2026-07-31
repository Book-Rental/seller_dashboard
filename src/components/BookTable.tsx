import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import { SellerBook } from "../types/book";
import AvailabilityBadge from "./AvailabilityBadge";
import { useState } from "react";
import DeleteBookModal from "./DeleteBookModal";
import { useDeleteBook } from "../hooks/useDeleteBook";
import { showToast } from "../utils/toast";
import { redirectToEditBook } from "../utils/sellerNavigation";

type Props = {
    books: SellerBook[];
};

const BookTable = ({
    books,
}: Props) => {

    const [selectedBook, setSelectedBook] =
        useState<SellerBook | null>(null);

    const { mutate: deleteBook, isPending } =
        useDeleteBook();

    const handleDelete = () => {
        if (!selectedBook) return;

        deleteBook(selectedBook._id, {
            onSuccess: () => {
                showToast(
                    "Book deleted successfully",
                    "success"
                );

                setSelectedBook(null);
            },
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                showToast(
                    error.message ||
                    "Failed to delete book",
                    "error"
                );
            },
        });
    };
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-[900px] w-full">

                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Book
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Category
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Price / Week
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Stock
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Availability
                        </th>

                        <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                    {books.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="py-10 text-center text-gray-500"
                            >
                                No Books Found
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => {

                            return (
                                <tr
                                    key={book._id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-3 py-3 sm:px-6 sm:py-4">

                                        <div className="flex min-w-[220px] items-center gap-3">

                                            <img
                                                src={book.coverImage}
                                                alt={book.name}
                                                className="h-14 w-10 rounded-md border object-cover sm:h-16 sm:w-12"
                                            />

                                            <span className="line-clamp-2 text-sm font-medium sm:text-base">
                                                {book.name}
                                            </span>

                                        </div>

                                    </td>

                                    <td className="px-3 py-3 text-sm capitalize sm:px-6 sm:py-4">
                                        {book.categoryId.name}
                                    </td>

                                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4">
                                        ₹
                                        {
                                            book.rentalPricePerWeek
                                        }
                                    </td>

                                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4">
                                        {book.quantity}
                                    </td>

                                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                                        <AvailabilityBadge
                                            status={
                                                book.availabilityStatus
                                            }
                                        />
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex min-w-[150px] justify-center gap-2">
                                            <Rb_Button
                                                variant="secondary"
                                                size="sm"
                                                className="whitespace-nowrap"
                                                onClick={() =>
                                                    redirectToEditBook(book._id)
                                                }
                                            >
                                                Edit
                                            </Rb_Button>

                                            <Rb_Button
                                                variant="secondary"
                                                size="sm"
                                                className="whitespace-nowrap border-red-500 text-red-600 hover:bg-red-50"
                                                onClick={() =>
                                                    setSelectedBook(book)
                                                }
                                            >
                                                Delete
                                            </Rb_Button>
                                        </div>

                                    </td>

                                </tr>
                            );
                        })
                    )}

                </tbody>

            </table>
            <DeleteBookModal
                open={!!selectedBook}
                bookName={selectedBook?.name ?? ""}
                loading={isPending}
                onClose={() => setSelectedBook(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default BookTable;