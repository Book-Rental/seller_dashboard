import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import BookTable from "../components/BookTable";
import type { SellerBook } from "../types/book";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});

const renderBookTable = (books: SellerBook[]) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <BookTable books={books} />
        </QueryClientProvider>
    );
};

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: unknown;
};

type DeleteModalProps = {
    open: boolean;
    bookName: string;
    onClose: () => void;
    onConfirm: () => void;
};

type AuctionConfirmDetails = {
    startingBid: string;
    buyNowPrice: string;
    duration: string;
    startDate: string;
};

type AuctionDetailsModalProps = {
    isOpen: boolean;
    book: unknown;
    onClose: () => void;
    onConfirm: (details: AuctionConfirmDetails) => void;
};

type DeleteMutationOptions = {
    onSuccess?: () => void;
    onError?: (error: { message?: string }) => void;
};

const {
    mockDeleteBook,
    mockRedirectToEditBook,
    mockRedirectToBookDetails,
    mockShowToast,
} = vi.hoisted(() => ({
    mockDeleteBook: vi.fn(),
    mockRedirectToEditBook: vi.fn(),
    mockRedirectToBookDetails: vi.fn(),
    mockShowToast: vi.fn(),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({
        children,
        onClick,
        disabled,
        ...props
    }: ButtonProps) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    ),
}));

vi.mock("../components/AvailabilityBadge", () => ({
    default: ({ status }: { status: string }) => (
        <span data-testid="availability-badge">
            {status}
        </span>
    ),
}));

vi.mock("../components/DeleteBookModal", () => ({
    default: ({
        open,
        bookName,
        onClose,
        onConfirm,
    }: DeleteModalProps) =>
        open ? (
            <div data-testid="delete-modal">
                <p>{bookName}</p>

                <button type="button" onClick={onClose}>
                    Cancel
                </button>

                <button type="button" onClick={onConfirm}>
                    Confirm Delete
                </button>
            </div>
        ) : null,
}));

vi.mock("../components/AuctionDetailsModal", () => ({
    default: ({
        isOpen,
        onClose,
        onConfirm,
    }: AuctionDetailsModalProps) =>
        isOpen ? (
            <div data-testid="auction-details-modal">
                <button type="button" onClick={onClose}>
                    Close Auction Modal
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onConfirm({
                            startingBid: "100",
                            buyNowPrice: "500",
                            duration: "24",
                            startDate: "2026-09-16",
                        })
                    }
                >
                    Confirm Auction
                </button>
            </div>
        ) : null,
}));

vi.mock("../hooks/useDeleteBook", () => ({
    useDeleteBook: () => ({
        mutate: mockDeleteBook,
        isPending: false,
    }),
}));

vi.mock("../hooks/useCancelAuction", () => ({
    useCancelAuction: () => ({
        mutate: vi.fn(),
        isPending: false,
    }),
}));

vi.mock("../model/CancelAuctionModal", () => ({
    default: () => null,
}));

vi.mock("../utils/toast", () => ({
    showToast: mockShowToast,
}));

vi.mock("../utils/sellerNavigation", () => ({
    redirectToEditBook: mockRedirectToEditBook,
    redirectToBookDetails: mockRedirectToBookDetails,
}));

const baseBook: SellerBook = {
    _id: "book-1",
    sellerId: "seller-1",

    name: "Atomic Habits",
    description: "A self-help book",
    coverImage: "cover.jpg",

    images: ["cover.jpg"],

    author: "James Clear",
    language: "English",
    edition: "1st",

    categoryId: {
        _id: "cat-1",
        name: "Self Help",
    },

    purchasePrice: 500,

    rentalPricePerDay: 50,
    rentalPricePerWeek: 250,
    rentalPricePerMonth: 800,

    securityDeposit: 1000,

    quantity: 5,

    availabilityStatus: "available",

    availableForRent: true,
    availableForSale: true,

    isAvailable: true,
    isActive: true,
    isAuction: false,

    listingType: "both",
    condition: "new",
    status: "active",

    auction: [],

    createdAt: "2026-07-31T10:00:00.000Z",
    updatedAt: "2026-07-31T10:00:00.000Z",
};

const createAuction = (
    status: "upcoming" | "live" | "completed" | "cancelled",
    order: {
        _id: string;
        orderNumber: string;
        orderType: string;
        orderStatus: string;
        isActive: boolean;
    } | null = null
) => ({
    _id: "auction-1",
    bookId: "book-1",
    bidPrice: 100,
    buyNowPrice: 500,
    duration: 24,
    startDate: "2026-09-15",
    status,
    isActive: status === "live" || status === "upcoming",
    currentBidPrice: 200,
    highestBidder: null,
    highestBid: null,
    bidCount: 0,
    order,
});

const books = [baseBook];

describe("BookTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders table headers", () => {
        renderBookTable(books);

        expect(screen.getByText("Book")).toBeInTheDocument();
        expect(screen.getByText("Category")).toBeInTheDocument();
        expect(screen.getByText("Availability")).toBeInTheDocument();
        expect(screen.getByText("Auction")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders book details", () => {
        renderBookTable(books);

        expect(
            screen.getAllByText("Atomic Habits")[0]
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("Self Help")[0]
        ).toBeInTheDocument();
    });

    it("renders availability badge", () => {
        renderBookTable(books);

        const badges = screen.getAllByTestId(
            "availability-badge"
        );

        expect(badges.length).toBeGreaterThan(0);
        badges.forEach((badge) =>
            expect(badge).toHaveTextContent("available")
        );
    });

    it("renders Start auction button when there is no auction", () => {
        renderBookTable(books);

        expect(
            screen.getAllByRole("button", {
                name: "Start auction",
            })[0]
        ).toBeInTheDocument();
    });

    it("opens auction details modal when Start auction is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        await user.click(
            screen.getAllByRole("button", {
                name: "Start auction",
            })[0]
        );

        expect(
            screen.getByTestId("auction-details-modal")
        ).toBeInTheDocument();
    });

    it("closes auction details modal", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        await user.click(
            screen.getAllByRole("button", {
                name: "Start auction",
            })[0]
        );

        expect(
            screen.getByTestId("auction-details-modal")
        ).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", {
                name: "Close Auction Modal",
            })
        );

        expect(
            screen.queryByTestId("auction-details-modal")
        ).not.toBeInTheDocument();
    });

    it("shows live auction toggle when auction status is live", () => {
        const liveBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: [createAuction("live")],
            },
        ];

        renderBookTable(liveBooks);

        expect(screen.getAllByText("Live")[0]).toBeInTheDocument();
    });

    it("shows Upcoming auction for upcoming auction", () => {
        const book = {
            ...baseBook,
            isAuction: true,
            auction: [createAuction("upcoming")],
        };

        renderBookTable([book]);

        expect(
            screen.getAllByText("Upcoming")[0]
        ).toBeInTheDocument();

        expect(
            screen.getAllByRole("button", {
                name: "Cancel auction",
            })[0]
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Start auction",
            })
        ).not.toBeInTheDocument();
    });

    it("shows Cancelled for cancelled auction", () => {
        const cancelledBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: [createAuction("cancelled")],
            },
        ];

        renderBookTable(cancelledBooks);

        expect(
            screen.getAllByText("Cancelled")[0]
        ).toBeInTheDocument();

        expect(
            screen.getAllByRole("button", {
                name: "Start new auction",
            })[0]
        ).toBeInTheDocument();
    });

    it("shows Completed when completed auction has no order", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: [createAuction("completed")],
            },
        ];

        renderBookTable(completedBooks);

        expect(
            screen.getAllByText("Completed")[0]
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Cancel auction",
            })
        ).not.toBeInTheDocument();
    });

    it("shows order status when completed auction has an order", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: [
                    createAuction("completed", {
                        _id: "order-1",
                        orderNumber: "ORD-001",
                        orderType: "auction",
                        orderStatus: "pending",
                        isActive: true,
                    }),
                ],
            },
        ];

        renderBookTable(completedBooks);

        expect(
            screen.getAllByText("pending")[0]
        ).toBeInTheDocument();

        expect(screen.queryByText("Completed")).not.toBeInTheDocument();
    });

    it("does not show Start auction for completed auction", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: [createAuction("completed")],
            },
        ];

        renderBookTable(completedBooks);

        expect(
            screen.queryByRole("button", {
                name: "Start auction",
            })
        ).not.toBeInTheDocument();
    });

    it("calls redirectToEditBook when Edit is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        const editButtons = screen.getAllByRole("button", {
            name: "Edit book",
        });

        await user.click(editButtons[0]);

        expect(mockRedirectToEditBook).toHaveBeenCalledWith("book-1");
    });

    it("calls redirectToBookDetails when book name is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        const bookButtons = screen.getAllByRole("button", {
            name: "Atomic Habits",
        });

        await user.click(bookButtons[0]);

        expect(mockRedirectToBookDetails).toHaveBeenCalledWith(books[0]);
    });

    it("opens delete modal when Delete is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });

    it("closes delete modal when Cancel is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        await user.click(
            screen.getByRole("button", { name: "Cancel" })
        );

        expect(
            screen.queryByTestId("delete-modal")
        ).not.toBeInTheDocument();
    });

    it("calls deleteBook when Confirm Delete is clicked", async () => {
        const user = userEvent.setup();

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        await user.click(
            screen.getByRole("button", { name: "Confirm Delete" })
        );

        expect(mockDeleteBook).toHaveBeenCalledTimes(1);
        expect(mockDeleteBook).toHaveBeenCalledWith(
            "book-1",
            expect.any(Object)
        );
    });

    it("renders empty state", () => {
        renderBookTable([]);

        expect(
            screen.getAllByText("No books found")[0]
        ).toBeInTheDocument();
    });

    it("does not render any books when empty", () => {
        renderBookTable([]);

        expect(
            screen.queryByText("Atomic Habits")
        ).not.toBeInTheDocument();
    });

    it("shows success toast after deleting a book", async () => {
        const user = userEvent.setup();

        mockDeleteBook.mockImplementation(
            (_id: string, options: DeleteMutationOptions) => {
                options.onSuccess?.();
            }
        );

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        await user.click(
            screen.getByRole("button", { name: "Confirm Delete" })
        );

        expect(mockShowToast).toHaveBeenCalledWith(
            "Book deleted successfully",
            "success"
        );

        expect(
            screen.queryByTestId("delete-modal")
        ).not.toBeInTheDocument();
    });

    it("shows error toast when delete fails", async () => {
        const user = userEvent.setup();

        mockDeleteBook.mockImplementation(
            (_id: string, options: DeleteMutationOptions) => {
                options.onError?.({ message: "Delete failed" });
            }
        );

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        await user.click(
            screen.getByRole("button", { name: "Confirm Delete" })
        );

        expect(mockShowToast).toHaveBeenCalledWith(
            "Delete failed",
            "error"
        );
    });

    it("shows default error message when error has no message", async () => {
        const user = userEvent.setup();

        mockDeleteBook.mockImplementation(
            (_id: string, options: DeleteMutationOptions) => {
                options.onError?.({});
            }
        );

        renderBookTable(books);

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete book",
        });

        await user.click(deleteButtons[0]);

        await user.click(
            screen.getByRole("button", { name: "Confirm Delete" })
        );

        expect(mockShowToast).toHaveBeenCalledWith(
            "Failed to delete book",
            "error"
        );
    });
});