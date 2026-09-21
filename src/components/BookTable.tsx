import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import { SellerBook } from "../types/book";
import AvailabilityBadge from "./AvailabilityBadge";
import { useState } from "react";
import DeleteBookModal from "./DeleteBookModal";
import AuctionDetailsModal from "./AuctionDetailsModal";
import { useDeleteBook } from "../hooks/useDeleteBook";
import { showToast } from "../utils/toast";
import {
    redirectToBookDetails,
    redirectToEditBook,
} from "../utils/sellerNavigation";
import { MdOutlineDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";

type Props = {
    books: SellerBook[];
};

const BookTable = ({ books }: Props) => {
    const [selectedBook, setSelectedBook] =
        useState<SellerBook | null>(null);

    const [auctionBook, setAuctionBook] =
        useState<SellerBook | null>(null);

    const { mutate: deleteBook, isPending } =
        useDeleteBook();

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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Auction
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
                                colSpan={7}
                                className="py-10 text-center text-gray-500"
                            >
                                No Books Found
                            </td>
                        </tr>
                    ) : (
                        books.map((book) => {
                            /*
                             * IMPORTANT:
                             * API returns auctionId
                             */
                           const auctionState =
    book.auction?.status;
    const hasAuctionOrder =
    !!book.auction?.order;

const auctionOrderStatus =
    book.auction?.order?.orderStatus;

                            return (
                                <tr
                                    key={book._id}
                                    className="hover:bg-gray-50"
                                >
                                    {/* Book */}
                                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                                        <div className="flex min-w-[220px] items-center gap-3">
                                            <img
                                                src={
                                                    book.coverImage
                                                }
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
                                                {book.name}
                                            </button>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-3 py-3 text-sm capitalize sm:px-6 sm:py-4">
                                        {book.categoryId?.name ??
                                            "-"}
                                    </td>

                                    {/* Price */}
                                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4">
                                        ₹
                                        {
                                            book.rentalPricePerWeek
                                        }
                                    </td>

                                    {/* Stock */}
                                    <td className="px-3 py-3 text-sm sm:px-6 sm:py-4">
                                        {book.quantity}
                                    </td>

                                    {/* Availability */}
                                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                                        <AvailabilityBadge
                                            status={
                                                book.availabilityStatus
                                            }
                                        />
                                    </td>

                                    {/* Auction */}
<td className="px-4 py-4 text-center">
    {/* LIVE */}
    {auctionState === "live" && (
        <button
            type="button"
            onClick={() => {
                showToast(
                    "This book is currently live in auction",
                    "error"
                );
            }}
            className="inline-flex items-center"
            aria-label="Live auction"
        >
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition">
                <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white shadow transition" />
            </span>
        </button>
    )}

    {/* UPCOMING */}
    {auctionState === "upcoming" && (
        <button
            type="button"
            onClick={() => setAuctionBook(book)}
            className="inline-flex items-center"
            aria-label="Upcoming auction"
        >
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition">
                <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white shadow transition" />
            </span>
        </button>
    )}

    {/* COMPLETED + ORDER */}
    {auctionState === "completed" &&
        hasAuctionOrder && (
            <span className="font-semibold capitalize text-blue-600">
                {auctionOrderStatus ?? "Order Created"}
            </span>
        )}

    {/* COMPLETED WITHOUT ORDER */}
    {auctionState === "completed" &&
        !hasAuctionOrder && (
            <span className="font-semibold text-gray-500">
                Auction Completed
            </span>
        )}

    {/* CANCELLED */}
    {auctionState === "cancelled" && (
        <span className="font-semibold text-red-500">
            Cancelled
        </span>
    )}

    {/* NO AUCTION */}
    {!auctionState && (
        <button
            type="button"
            onClick={() => setAuctionBook(book)}
            className="inline-flex items-center"
            aria-label="Enable Auction"
        >
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition">
                <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition" />
            </span>
        </button>
    )}
</td>
                                    {/* Actions */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex min-w-[150px] justify-center gap-2">
                                            <Rb_Button
                                                variant="secondary"
                                                size="sm"
                                                className="whitespace-nowrap"
                                                aria-label="Edit book"
                                                onClick={() =>
                                                    redirectToEditBook(
                                                        book._id
                                                    )
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
                                                    setSelectedBook(
                                                        book
                                                    )
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
                onClose={() =>
                    setSelectedBook(null)
                }
                onConfirm={handleDelete}
            />

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