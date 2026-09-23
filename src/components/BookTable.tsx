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
import { Gavel } from "lucide-react";
import { useCancelAuction } from "../hooks/useCancelAuction";
import CancelAuctionModal from "../model/CancelAuctionModal";

type Props = {
    books: SellerBook[];
};

const CELL = "px-3 py-3 sm:px-6 sm:py-4";

type AuctionStatus =
    | "upcoming"
    | "live"
    | "completed"
    | "cancelled"
    | undefined;

// Semantic auction-status badge, consistent with the status-pill
// conventions used elsewhere in RentBook (blue = active/live,
// amber = pending, gray = neutral/completed, red = cancelled).
const AUCTION_BADGE: Record<
    "live" | "upcoming" | "completed" | "cancelled" | "none",
    { label: string; className: string; dot?: string }
> = {
    live: {
        label: "Live",
        className: "bg-green-50 text-green-700 ring-1 ring-green-100",
        dot: "bg-green-500",
    },
    upcoming: {
        label: "Upcoming",
        className: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
        dot: "bg-amber-500",
    },
    completed: {
        label: "Completed",
        className: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-red-50 text-red-600 ring-1 ring-red-100",
    },
    none: {
        label: "Not Listed",
        className: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
    },
};

const AuctionBadge = ({
    variant,
    label,
}: {
    variant: keyof typeof AUCTION_BADGE;
    label?: string;
}) => {
    const cfg = AUCTION_BADGE[variant];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cfg.className}`}
        >
            {cfg.dot && (
                <span
                    className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${
                        variant === "live" ? "animate-pulse" : ""
                    }`}
                />
            )}
            {label ?? cfg.label}
        </span>
    );
};

// A small rotating palette so categories are visually distinct without
// needing a color mapped per category in the backend. Same category
// name always resolves to the same color (simple string hash).
const CATEGORY_COLORS = [
    "bg-violet-50 text-violet-700 ring-violet-100",
    "bg-sky-50 text-sky-700 ring-sky-100",
    "bg-rose-50 text-rose-700 ring-rose-100",
    "bg-emerald-50 text-emerald-700 ring-emerald-100",
    "bg-orange-50 text-orange-700 ring-orange-100",
    "bg-cyan-50 text-cyan-700 ring-cyan-100",
];

const getCategoryColor = (name: string) => {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

const CategoryTag = ({ name }: { name?: string }) => {
    if (!name) {
        return (
            <span className="inline-flex items-center rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-400 ring-1 ring-gray-200">
                Uncategorized
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getCategoryColor(
                name
            )}`}
        >
            {name}
        </span>
    );
};

const BookTable = ({ books }: Props) => {
    const [selectedBook, setSelectedBook] =
        useState<SellerBook | null>(null);

    const [auctionBook, setAuctionBook] =
        useState<SellerBook | null>(null);

    const [cancelAuctionBook, setCancelAuctionBook] =
        useState<SellerBook | null>(null);

    const [auctionStatusOverrides, setAuctionStatusOverrides] =
        useState<Record<string, AuctionStatus>>({});

    const { mutate: deleteBook, isPending } =
        useDeleteBook();

    const {
        mutate: cancelAuction,
        isPending: isCancellingAuction,
    } = useCancelAuction();

    /*
     * Get the current/latest auction.
     *
     * Book.auctionId points to the current auction.
     * book.auction[] contains the complete auction history.
     */
    const getCurrentAuction = (book: SellerBook) => {
        if (!book.auction?.length) {
            return undefined;
        }

        if (book.auctionId) {
            const currentAuction = book.auction.find(
                (auction) =>
                    auction._id === book.auctionId
            );

            if (currentAuction) {
                return currentAuction;
            }
        }

        return book.auction[
            book.auction.length - 1
        ];
    };

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

    const handleCancelAuction = (
        book: SellerBook
    ) => {
        const currentAuction =
            getCurrentAuction(book);

        const auctionId =
            currentAuction?._id;

        if (!auctionId) {
            showToast(
                "Auction ID not found",
                "error"
            );
            return;
        }

        cancelAuction(auctionId, {
            onSuccess: () => {
                setAuctionStatusOverrides(
                    (prev) => ({
                        ...prev,
                        [book._id]: "cancelled",
                    })
                );

                setCancelAuctionBook(null);

                showToast(
                    "Auction cancelled successfully",
                    "success"
                );
            },

            onError: (error) => {
                showToast(
                    error instanceof Error
                        ? error.message
                        : "Failed to cancel auction",
                    "error"
                );
            },
        });
    };

    const getAuctionStatus = (
        book: SellerBook
    ): AuctionStatus => {
        if (
            auctionStatusOverrides[
                book._id
            ]
        ) {
            return auctionStatusOverrides[
                book._id
            ];
        }

        const currentAuction =
            getCurrentAuction(book);

        return currentAuction?.status;
    };

    const getCreatedAuctionStatus = (
        startDate: string,
        duration: string
    ): AuctionStatus => {
        const start =
            new Date(startDate).getTime();

        const now = Date.now();

        /*
         * Your backend duration is currently
         * being treated as days.
         */
        const durationInMs =
            Number(duration) *
            24 *
            60 *
            60 *
            1000;

        const end =
            start + durationInMs;

        if (now < start) {
            return "upcoming";
        }

        if (
            now >= start &&
            now < end
        ) {
            return "live";
        }

        return "completed";
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

        const newStatus =
            getCreatedAuctionStatus(
                details.startDate,
                details.duration
            );

        setAuctionStatusOverrides(
            (prev) => ({
                ...prev,
                [auctionBook._id]:
                    newStatus,
            })
        );

        setAuctionBook(null);
    };

    /*
     * Shared auction-cell renderer used by both the desktop table
     * and the mobile card layout, so the status logic lives in
     * exactly one place.
     */
    const renderAuctionCell = (book: SellerBook) => {
        const auctionState = getAuctionStatus(book);
        const currentAuction = getCurrentAuction(book);
        const hasAuctionOrder = !!currentAuction?.order;
        const auctionOrderStatus = currentAuction?.order?.orderStatus;

        if (auctionState === "live" || auctionState === "upcoming") {
            return (
                <div className="flex flex-col items-center gap-1.5">
                    <AuctionBadge variant={auctionState} />

                    <button
                        type="button"
                        onClick={() => setCancelAuctionBook(book)}
                        disabled={isCancellingAuction}
                        className="text-xs font-medium text-red-500 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel auction
                    </button>
                </div>
            );
        }

        if (auctionState === "completed" && hasAuctionOrder) {
            return (
                <AuctionBadge
                    variant="completed"
                    label={auctionOrderStatus}
                />
            );
        }

        if (auctionState === "completed" && !hasAuctionOrder) {
            return <AuctionBadge variant="completed" />;
        }

        if (auctionState === "cancelled") {
            return (
                <div className="flex flex-col items-center gap-1.5">
                    <AuctionBadge variant="cancelled" />

                    <button
                        type="button"
                        onClick={() => setAuctionBook(book)}
                        className="text-xs font-medium text-blue-600 underline-offset-2 hover:underline"
                    >
                        Start new auction
                    </button>
                </div>
            );
        }

        // No auction yet
        return (
            <div className="flex flex-col items-center gap-1.5">
                <AuctionBadge variant="none" />

                <button
                    type="button"
                    onClick={() => setAuctionBook(book)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 underline-offset-2 hover:underline"
                >
                    <Gavel size={12} />
                    Start auction
                </button>
            </div>
        );
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th
                                className={`${CELL} text-left text-xs font-semibold uppercase tracking-wide text-gray-500`}
                            >
                                Book
                            </th>

                            <th
                                className={`${CELL} text-left text-xs font-semibold uppercase tracking-wide text-gray-500`}
                            >
                                Category
                            </th>

                            <th
                                className={`${CELL} text-left text-xs font-semibold uppercase tracking-wide text-gray-500`}
                            >
                                Availability
                            </th>

                            <th
                                className={`${CELL} text-center text-xs font-semibold uppercase tracking-wide text-gray-500`}
                            >
                                Auction
                            </th>

                            <th
                                className={`${CELL} text-center text-xs font-semibold uppercase tracking-wide text-gray-500`}
                            >
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {books.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-14 text-center text-gray-500"
                                >
                                    No books found
                                </td>
                            </tr>
                        ) : (
                            books.map((book) => {
                                return (
                                    <tr
                                        key={book._id}
                                        className="transition-colors hover:bg-blue-50/40"
                                    >
                                        {/* Book */}
                                        <td className={CELL}>
                                            <div className="flex min-w-[220px] items-center gap-3">
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.name}
                                                    className="h-14 w-10 rounded-md border border-gray-200 object-cover shadow-sm sm:h-16 sm:w-12"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        redirectToBookDetails(
                                                            book
                                                        )
                                                    }
                                                    className="line-clamp-2 text-left text-sm font-medium text-[#1B1530] hover:text-blue-600 hover:underline sm:text-base"
                                                >
                                                    {book.name}
                                                </button>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className={CELL}>
                                            <CategoryTag
                                                name={book.categoryId?.name}
                                            />
                                        </td>

                                        {/* Availability */}
                                        <td className={CELL}>
                                            <AvailabilityBadge
                                                status={
                                                    book.availabilityStatus
                                                }
                                            />
                                        </td>

                                        {/* Auction */}
                                        <td
                                            className={`${CELL} text-center`}
                                        >
                                            {renderAuctionCell(book)}
                                        </td>

                                        {/* Actions */}
                                        <td
                                            className={`${CELL} text-center`}
                                        >
                                            <div className="flex min-w-[130px] justify-center gap-2">
                                                <Rb_Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="!border-gray-300 !text-gray-600 hover:!bg-gray-50"
                                                    aria-label="Edit book"
                                                    title="Edit book"
                                                    onClick={() =>
                                                        redirectToEditBook(
                                                            book._id
                                                        )
                                                    }
                                                >
                                                    <TbEdit size={16} />
                                                </Rb_Button>

                                                <Rb_Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="!border-red-200 !text-red-600 hover:!bg-red-50"
                                                    aria-label="Delete book"
                                                    title="Delete book"
                                                    onClick={() =>
                                                        setSelectedBook(book)
                                                    }
                                                >
                                                    <MdOutlineDelete
                                                        size={16}
                                                    />
                                                </Rb_Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
                {books.length === 0 ? (
                    <p className="py-14 text-center text-gray-500">
                        No books found
                    </p>
                ) : (
                    books.map((book) => {
                        return (
                            <div key={book._id} className="p-4">
                                <div className="flex gap-3">
                                    <img
                                        src={book.coverImage}
                                        alt={book.name}
                                        className="h-20 w-14 shrink-0 rounded-md border border-gray-200 object-cover shadow-sm"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                redirectToBookDetails(book)
                                            }
                                            className="line-clamp-2 text-left text-sm font-medium text-[#1B1530] hover:text-blue-600 hover:underline"
                                        >
                                            {book.name}
                                        </button>

                                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                            <CategoryTag
                                                name={book.categoryId?.name}
                                            />

                                            <AvailabilityBadge
                                                status={
                                                    book.availabilityStatus
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                                    {renderAuctionCell(book)}

                                    <div className="flex gap-2">
                                        <Rb_Button
                                            variant="secondary"
                                            size="sm"
                                            className="!border-gray-300 !text-gray-600"
                                            aria-label="Edit book"
                                            title="Edit book"
                                            onClick={() =>
                                                redirectToEditBook(book._id)
                                            }
                                        >
                                            <TbEdit size={16} />
                                        </Rb_Button>

                                        <Rb_Button
                                            variant="secondary"
                                            size="sm"
                                            className="!border-red-200 !text-red-600"
                                            aria-label="Delete book"
                                            title="Delete book"
                                            onClick={() =>
                                                setSelectedBook(book)
                                            }
                                        >
                                            <MdOutlineDelete size={16} />
                                        </Rb_Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Cancel Auction Modal */}
            <CancelAuctionModal
                open={
                    !!cancelAuctionBook
                }
                bookName={
                    cancelAuctionBook?.name ??
                    ""
                }
                loading={
                    isCancellingAuction
                }
                onClose={() =>
                    setCancelAuctionBook(
                        null
                    )
                }
                onConfirm={() => {
                    if (
                        cancelAuctionBook
                    ) {
                        handleCancelAuction(
                            cancelAuctionBook
                        );
                    }
                }}
            />

            {/* Delete Book Modal */}
            <DeleteBookModal
                open={!!selectedBook}
                bookName={
                    selectedBook?.name ?? ""
                }
                loading={isPending}
                onClose={() =>
                    setSelectedBook(null)
                }
                onConfirm={
                    handleDelete
                }
            />

            {/* Create Auction Modal */}
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