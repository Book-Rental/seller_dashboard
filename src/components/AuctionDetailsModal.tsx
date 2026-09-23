import { useEffect, useState } from "react";
import { Modal, Rb_Button } from "@rentbook/rentbook-ui-lib";
import { useCreateAuction } from "../hooks/useCreateAuction";

export type AuctionDetails = {
    startingBid: string;
    buyNowPrice: string;
    duration: string;
    startDate: string;
};
type AuctionBook = {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    coverImage?: string;
    categoryId?:
    | {
        name?: string;
    }
    | string;
    condition?: string;
};

type AuctionDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: AuctionDetails) => void;
    book: AuctionBook | null;
};

const AuctionDetailsModal = ({
    isOpen,
    onClose,
    onConfirm,
    book,
}: AuctionDetailsModalProps) => {
    const [step, setStep] = useState<1 | 2>(1);

    const [startingBid, setStartingBid] = useState("");
    const [buyNowPrice, setBuyNowPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [startDate, setStartDate] = useState("");

    const { mutateAsync: createAuction, isPending } =
        useCreateAuction();
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setStartingBid("");
            setBuyNowPrice("");
            setDuration("");
            setStartDate("");
        }
    }, [isOpen, book?.id, book?._id]);

    const getBookId = () => {
        return book?.id || book?._id || "";
    };

    const getBookName = () => {
        return book?.name || book?.title || "Book Title";
    };

    const getCategoryName = () => {
        if (!book?.categoryId) {
            return "Not selected";
        }

        if (typeof book.categoryId === "string") {
            return book.categoryId;
        }

        return book.categoryId.name || "Not selected";
    };

    const handleReview = () => {
        if (!startingBid || !duration || !startDate) {
            return;
        }

        setStep(2);
    };

    const handleBack = () => {
        if (isPending) {
            return;
        }

        setStep(1);
    };

    const handleSave = async () => {
        if (!book) {
            console.error("No book selected");
            return;
        }

        if (!startingBid || !duration || !startDate) {
            return;
        }

        const bookId = getBookId();

        if (!bookId) {
            console.error("Book ID is missing");
            return;
        }

        try {

            const durationInDays = Number(
                duration.replace("-days", "").replace("-day", "")
            );

            if (!durationInDays || Number.isNaN(durationInDays)) {
                console.error("Invalid auction duration:", duration);
                return;
            }

            const formattedStartDate = new Date(
                `${startDate}T00:00:00.000Z`
            ).toISOString();

            const payload = {
                bookId,
                bidPrice: Number(startingBid),
                ...(buyNowPrice
                    ? {
                        buyNowPrice: Number(buyNowPrice),
                    }
                    : {}),
                duration: durationInDays,
                startDate: formattedStartDate,
            };

            console.log(
                "Creating auction with payload:",
                payload
            );

            await createAuction(payload);

            onConfirm({
                startingBid,
                buyNowPrice,
                duration,
                startDate,
            });

            resetForm();
        } catch (error) {
            console.error(
                "Failed to create auction:",
                error
            );
        }
    };

    const resetForm = () => {
        setStep(1);
        setStartingBid("");
        setBuyNowPrice("");
        setDuration("");
        setStartDate("");
    };

    const handleClose = () => {
        if (isPending) {
            return;
        }

        resetForm();
        onClose();
    };

    const formatDuration = (value: string) => {
        switch (value) {
            case "1-day":
                return "1 Day";

            case "3-days":
                return "3 Days";

            case "5-days":
                return "5 Days";

            case "7-days":
                return "7 Days";

            case "14-days":
                return "14 Days";

            default:
                return "Not set";
        }
    };

    const formatDate = (date: string) => {
        if (!date) {
            return "Not set";
        }

        const [year, month, day] = date.split("-");

        if (!year || !month || !day) {
            return "Not set";
        }

        return `${day}-${month}-${year}`;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div className="flex max-h-[90vh] flex-col">
                {step === 1 ? (
                    <>

                        <div className="border-b border-gray-200 px-6 py-5">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Auction Details
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Set the details for your book auction.
                            </p>
                        </div>

                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Starting Bid{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={startingBid}
                                        onChange={(e) =>
                                            setStartingBid(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter starting bid"
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Buy Now Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={buyNowPrice}
                                        onChange={(e) =>
                                            setBuyNowPrice(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Optional"
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Auction Duration{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        value={duration}
                                        onChange={(e) =>
                                            setDuration(
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select duration
                                        </option>

                                        <option value="1-day">
                                            1 Day
                                        </option>

                                        <option value="3-days">
                                            3 Days
                                        </option>

                                        <option value="5-days">
                                            5 Days
                                        </option>

                                        <option value="7-days">
                                            7 Days
                                        </option>

                                        <option value="14-days">
                                            14 Days
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Start Date{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <Rb_Button
                                variant="primary"
                                onClick={handleReview}
                                disabled={
                                    !startingBid ||
                                    !duration ||
                                    !startDate
                                }
                            >
                                Next: Review →
                            </Rb_Button>
                        </div>
                    </>
                ) : (
                    <>

                        <div className="border-b border-gray-200 px-6 py-5">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Review Auction
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Review your book and auction details before saving.
                            </p>
                        </div>

                        <div className="overflow-y-auto">


                            <div className="border-b border-gray-200 px-6 py-5">
                                <div className="flex gap-4">

                                    <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                                        {book?.coverImage ? (
                                            <img
                                                src={book.coverImage}
                                                alt={getBookName()}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="px-2 text-center text-xs text-gray-400">
                                                No Image
                                            </span>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {getBookName()}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            by Author Name
                                        </p>

                                        <span className="mt-2 inline-block rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                                            {book?.condition ||
                                                "Good"}
                                        </span>

                                        <div className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Category
                                                </p>

                                                <p className="mt-1 text-sm text-gray-900">
                                                    {getCategoryName()}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    Condition
                                                </p>

                                                <p className="mt-1 text-sm text-gray-900">
                                                    {book?.condition ||
                                                        "Good"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-5">
                                <div className="border-b border-gray-200 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Starting Bid
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Set a competitive starting price
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm font-semibold text-green-600">
                                            ₹{startingBid || "0.00"}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Buy Now Price{" "}
                                                <span className="font-normal text-gray-400">
                                                    (Optional)
                                                </span>
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Allows users to buy instantly
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm text-gray-400">
                                            {buyNowPrice
                                                ? `₹${buyNowPrice}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-b border-gray-200 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Auction Duration
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Set how long your auction will run
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm text-gray-400">
                                            {formatDuration(
                                                duration
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Start Date
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                When the auction will begin
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm text-gray-400">
                                            {formatDate(startDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                disabled={isPending}
                                className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                ← Back
                            </button>

                            <Rb_Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Saving..."
                                    : "Save Auction"}
                            </Rb_Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default AuctionDetailsModal;