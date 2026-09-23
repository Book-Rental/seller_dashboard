import React from "react";
import { Rb_Button } from "@rentbook/rentbook-ui-lib";
import { SellerBook } from "../types/book";
import { redirectToMyBooks } from "../utils/sellerNavigation";
import { useAuctionBooks } from "../hooks/useAuctionBooks";

type Props = {
    book: SellerBook;
};

const BookDetailsPage: React.FC<Props> = ({
    book,
}) => {
    const handleBack = () => {
        redirectToMyBooks();
    };

    const formatCurrency = (value: number) => {
        return `₹${value.toLocaleString("en-IN")}`;
    };
    const {
        data: auctionBooks = [],
        isLoading: isAuctionLoading,
        isError: isAuctionError,
    } = useAuctionBooks();
   const auctionBook = auctionBooks.find(
    (auctionBook) => auctionBook._id === book._id
);

const auction = Array.isArray(auctionBook?.auction)
    ? auctionBook.auction.find(
        (auction) => auction.isActive === true
    )
    : undefined;
    const formatDate = (
        date?: string
    ): string => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };
    const formatStatus = (
        status?: string
    ): string => {
        if (!status) {
            return "Active";
        }

        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Book Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View complete information
                        about this book
                    </p>
                </div>

                <Rb_Button
                    variant="secondary"
                    onClick={handleBack}
                >
                    Back to Books
                </Rb_Button>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                    <div className="flex gap-8">
                        <div className="w-[200px] flex-shrink-0">
                            <img
                                src={book.coverImage}
                                alt={book.name}
                                className="h-[300px] w-[200px] rounded-lg border border-gray-200 object-cover"
                            />
                        </div>
                        <div className="flex-1">

                            <h2 className="text-2xl font-semibold text-gray-900">
                                {book.name}
                            </h2>

                            <div className="mt-4">

                                <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                    {
                                        book
                                            .categoryId
                                            ?.name
                                    }
                                </span>

                            </div>

                            <div className="mt-6 grid grid-row-1 gap-x-6 gap-y-5">

                                <DetailItem
                                    label="Author"
                                    value={
                                        book.author
                                    }
                                />

                                <DetailItem
                                    label="Language"
                                    value={
                                        book.language
                                    }
                                />

                                <DetailItem
                                    label="Edition"
                                    value={
                                        book.edition
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </div>

                <DetailSection title="Description">

                    <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                        {book.description ||
                            "No description available."}
                    </p>

                </DetailSection>

                <DetailSection title="Pricing & Rental">

                    <div className="grid grid-cols-4 gap-5">

                        <PriceCard
                            label="Purchase Price"
                            value={formatCurrency(
                                book.purchasePrice ?? 0
                            )}
                        />

                        <PriceCard
                            label="Rental / Day"
                            value={formatCurrency(
                                book.rentalPricePerDay
                            )}
                        />

                        <PriceCard
                            label="Rental / Week"
                            value={formatCurrency(
                                book.rentalPricePerWeek
                            )}
                        />

                        <PriceCard
                            label="Rental / Month"
                            value={formatCurrency(
                                book.rentalPricePerMonth
                            )}
                        />

                    </div>

                    <div className="mt-5">

                        <PriceCard
                            label="Security Deposit"
                            value={formatCurrency(
                                book.securityDeposit
                            )}
                        />

                    </div>

                </DetailSection>

                {isAuctionLoading && (
                    <DetailSection title="Auction Details">

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                            <p className="text-sm text-gray-500">
                                Loading auction
                                details...
                            </p>

                        </div>

                    </DetailSection>
                )}

                {!isAuctionLoading &&
                    isAuctionError && (
                        <DetailSection title="Auction Details">

                            <div className="rounded-lg border border-red-200 bg-red-50 p-5">

                                <p className="text-sm text-red-600">
                                    Unable to load
                                    auction details.
                                </p>

                            </div>

                        </DetailSection>
                    )}

{!isAuctionLoading &&
    !isAuctionError &&
    auction && (
        <DetailSection title="Auction Details">
            {/* Auction Status */}
            <div className="mb-5 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Auction Status
                    </p>

                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        {formatStatus(auction.status)}
                    </p>
                </div>

                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    In Auction
                </span>
            </div>

            {/* Auction Pricing */}
            <div className="grid grid-cols-4 gap-5">
                <PriceCard
                    label="Starting Bid"
                    value={formatCurrency(
                        auction.bidPrice
                    )}
                />

                <PriceCard
                    label="Current / Highest Bid"
                    value={formatCurrency(
                        auction.currentBidPrice
                    )}
                />

                <PriceCard
                    label="Buy Now Price"
                    value={
                        auction.buyNowPrice
                            ? formatCurrency(
                                  auction.buyNowPrice
                              )
                            : "-"
                    }
                />

                <PriceCard
                    label="Duration"
                    value={`${auction.duration} ${
                        auction.duration === 1
                            ? "Day"
                            : "Days"
                    }`}
                />
            </div>

            {/* Highest Bidder */}
            {(auction.status === "live" ||
                auction.status === "completed") &&
                auction.highestBidder && (
                    <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-5">
                        <h4 className="mb-4 text-base font-semibold text-gray-900">
                            Highest Bidder
                        </h4>

                        <div className="grid grid-cols-3 gap-5">
                            <DetailItem
                                label="Name"
                                value={
                                    auction
                                        .highestBidder
                                        .name
                                }
                            />

                            <DetailItem
                                label="Email"
                                value={
                                    auction
                                        .highestBidder
                                        .email
                                }
                            />

                            <DetailItem
                                label="Phone"
                                value={
                                    auction
                                        .highestBidder
                                        .phone ??
                                    "-"
                                }
                            />
                        </div>

                        <div className="mt-5">
                            <PriceCard
                                label="Highest Bid"
                                value={formatCurrency(
                                    auction.currentBidPrice
                                )}
                            />
                        </div>
                    </div>
                )}

            {/* Completed Auction Order */}
            {auction.status === "completed" &&
                auction.order && (
                    <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-5">
                        <h4 className="mb-4 text-base font-semibold text-gray-900">
                            Order Details
                        </h4>

                        <div className="grid grid-cols-3 gap-5">
                            <DetailItem
                                label="Order Number"
                                value={
                                    auction.order
                                        .orderNumber
                                }
                            />

                            <DetailItem
                                label="Order Type"
                                value={formatStatus(
                                    auction.order
                                        .orderType
                                )}
                            />

                            <DetailItem
                                label="Order Status"
                                value={formatStatus(
                                    auction.order
                                        .orderStatus
                                )}
                            />
                        </div>
                    </div>
                )}

            {/* Auction Dates / IDs */}
            <div className="mt-5 grid grid-cols-2 gap-5">
                <DetailItem
                    label="Auction Start Date"
                    value={formatDate(
                        auction.startDate
                    )}
                />

                {/* <DetailItem
                    label="Auction ID"
                    value={auction._id}
                /> */}
            </div>

            {/* <div className="mt-5">
                <DetailItem
                    label="Auction Book ID"
                    value={auction.bookId}
                />
            </div> */}
        </DetailSection>
    )}

            </div>
        </div>
    );
};

type DetailItemProps = {
    label: string;
    value?: string;
};

const DetailItem: React.FC<
    DetailItemProps
> = ({
    label,
    value,
}) => {
    return (
        <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-medium text-gray-900">
                {value || "-"}
            </p>

        </div>
    );
};

type DetailSectionProps = {
    title: string;
    children: React.ReactNode;
};

const DetailSection: React.FC<
    DetailSectionProps
> = ({
    title,
    children,
}) => {
    return (
        <div className="border-t border-gray-200 p-6">

            <h3 className="mb-5 text-lg font-semibold text-gray-900">
                {title}
            </h3>

            {children}

        </div>
    );
};

type PriceCardProps = {
    label: string;
    value: string;
};

const PriceCard: React.FC<
    PriceCardProps
> = ({
    label,
    value,
}) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

            <p className="text-xs font-medium text-gray-500">
                {label}
            </p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
                {value}
            </p>

        </div>
    );
};

export default BookDetailsPage;