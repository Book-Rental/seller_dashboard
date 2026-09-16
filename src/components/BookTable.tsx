import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import { SellerBook } from "../types/book";
import AvailabilityBadge from "./AvailabilityBadge";
import { useMemo, useState } from "react";
import DeleteBookModal from "./DeleteBookModal";
import AuctionDetailsModal from "./AuctionDetailsModal";
import { useDeleteBook } from "../hooks/useDeleteBook";
import { useAuctionBooks } from "../hooks/useAuctionBooks";
import { showToast } from "../utils/toast";
import {
    redirectToBookDetails,
    redirectToEditBook,
} from "../utils/sellerNavigation";
import { MdOutlineDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

type Props = {
    books: SellerBook[];
    auctionStatus?: Record<string, boolean>;
    onToggleAuction?: (bookId: string) => void;
};

const BookTable = ({
    books,
    auctionStatus,
    onToggleAuction,
}: Props) => {

    const [selectedBook, setSelectedBook] =
        useState<SellerBook | null>(null);

    const [auctionBook, setAuctionBook] =
        useState<SellerBook | null>(null);

    const { mutate: deleteBook, isPending } =
        useDeleteBook();

    const {
        data: auctionBooks = [],
        isLoading: isAuctionBooksLoading,
        isError: isAuctionBooksError,
    } = useAuctionBooks();

    const auctionBookIds = useMemo<Set<string>>(() => {
        return new Set(
            auctionBooks
                .map((book) => book._id)
                .filter(
                    (id): id is string => Boolean(id)
                )
        );
    }, [auctionBooks]);

    const handleDelete = () => {
        if (!selectedBook) {
            return;
        }

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

    const handleAuctionConfirm = (details: {
        startingBid: string;
        buyNowPrice: string;
        duration: string;
        startDate: string;
    }) => {
        if (!auctionBook) {
            return;
        }

        console.log("Auction Details:", {
            bookId: auctionBook._id,
            bookName: auctionBook.name,
            ...details,
        });

        onToggleAuction?.(auctionBook._id);

        setAuctionBook(null);
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

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">Auction</th>

                        <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Action
                        </th>

                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                    {books.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-10 text-center text-gray-500"
                            >
                                No Books Found
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => {
                            const isAuctionEnabled =
                                book.isAuction === true ||
                                auctionBookIds.has(
                                    book._id
                                ) ||
                                auctionStatus?.[
                                    book._id
                                ] === true;

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

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    redirectToBookDetails(
                                                        book
                                                    )
                                                }
                                                className="line-clamp-2 text-left text-sm font-medium text-blue-600 hover:underline sm:text-base"
                                            >
                                                {
                                                    book.name
                                                }
                                            </button>
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

                                    <td className="px-4 py-4 text-center">
                                        <button
                                            type="button"
                                            disabled={
                                                isAuctionBooksLoading ||
                                                isAuctionBooksError
                                            }
                                            onClick={() => {
                                                if (
                                                    isAuctionEnabled
                                                ) {
                                                    showToast(
                                                        "This book is already available for auction",
                                                        "error"
                                                    );

                                                    return;
                                                }
                                                setAuctionBook(
                                                    book
                                                );
                                            }}
                                            className="text-3xl disabled:cursor-not-allowed disabled:opacity-50"
                                            aria-label={
                                                isAuctionEnabled
                                                    ? "Book already available for auction"
                                                    : "Enable auction"
                                            }
                                        >
                                            {isAuctionEnabled ? (
                                                <FaToggleOn className="text-green-500" />
                                            ) : (
                                                <FaToggleOff className="text-gray-400" />
                                            )}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <div className="flex min-w-[150px] justify-center gap-2">
                                            <Rb_Button
                                                variant="secondary"
                                                size="sm"
                                                className="whitespace-nowrap"
                                                aria-label="Edit book"
                                                onClick={() =>
                                                    redirectToEditBook(book._id)
                                                }
                                            >
                                                <TbEdit />
                                            </Rb_Button>

                                            <Rb_Button
                                                variant="secondary"
                                                size="sm"
                                                className="whitespace-nowrap border-red-500 text-red-600 hover:bg-red-50"
                                                aria-label="Delete book"
                                                onClick={() =>
                                                    setSelectedBook(book)
                                                }
                                            >
                                                <MdOutlineDelete />
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

            {/* Auction Details Modal */}
            <AuctionDetailsModal
                isOpen={!!auctionBook}
                book={auctionBook}
                onClose={() =>
                    setAuctionBook(null)
                }
                onConfirm={
                    handleAuctionConfirm
                }
            />
        </div>
    );
};

export default BookTable;