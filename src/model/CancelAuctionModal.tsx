import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";


type Props = {
    open: boolean;
    bookName: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const CancelAuctionModal = ({
    open,
    bookName,
    loading = false,
    onClose,
    onConfirm,
}: Props) => {
    const confirmBtnRef = useRef<HTMLButtonElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !loading) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, loading, onClose]);

    // Focus the confirm button on open
    useEffect(() => {
        if (open) confirmBtnRef.current?.focus();
    }, [open]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px] animate-in fade-in duration-150"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) onClose();
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="cancel-auction-title"
                aria-describedby="cancel-auction-desc"
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle
                                className="h-5 w-5 text-red-600"
                                aria-hidden="true"
                            />
                        </span>
                        <h2
                            id="cancel-auction-title"
                            className="text-lg font-semibold text-gray-900"
                        >
                            Cancel Auction
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                        className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <p
                    id="cancel-auction-desc"
                    className="mt-4 text-sm leading-6 text-gray-600"
                >
                    Are you sure you want to cancel the auction for{" "}
                    <span className="font-semibold text-gray-900">
                        {bookName}
                    </span>
                    ?
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    The book will no longer be marked as an auction book.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Keep Auction
                    </button>

                    <button
                        ref={confirmBtnRef}
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}
                        {loading ? "Cancelling..." : "Cancel Auction"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelAuctionModal;