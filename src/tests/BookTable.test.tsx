import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookTable from "../components/BookTable";

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

                <button
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                >
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
                <button
                    type="button"
                    onClick={onClose}
                >
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

vi.mock("../utils/toast", () => ({
    showToast: mockShowToast,
}));

vi.mock("../utils/sellerNavigation", () => ({
    redirectToEditBook: mockRedirectToEditBook,
    redirectToBookDetails: mockRedirectToBookDetails,
}));

const baseBook = {
    _id: "book-1",
    sellerId: "seller-1",
    name: "Atomic Habits",
    description: "A self-help book",
    coverImage: "cover.jpg",

    images: [
        {
            url: "cover.jpg",
            altText: "Atomic Habits Cover",
        },
    ],

    author: "James Clear",
    language: "English",
    edition: "1st",
    isbn: "9780735211292",

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

    createdAt: "2026-07-31T10:00:00.000Z",
    updatedAt: "2026-07-31T10:00:00.000Z",
};

const createAuction = (
    status:
        | "upcoming"
        | "live"
        | "completed"
        | "cancelled",
    order: {
        _id: string;
        orderNumber: string;
        orderType: string;
        orderStatus: string;
    } | null = null
) => ({
    _id: "auction-1",
    bookId: "book-1",

    bidPrice: 100,
    buyNowPrice: 500,

    duration: 24,
    startDate: "2026-09-15",

    status,

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
        render(<BookTable books={books} />);

        expect(
            screen.getByText("Book")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Category")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Price / Week")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Stock")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Availability")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Auction")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Action")
        ).toBeInTheDocument();
    });

    it("renders book details", () => {
        render(<BookTable books={books} />);

        expect(
            screen.getByText("₹250")
        ).toBeInTheDocument();

        expect(
            screen.getByText("5")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Atomic Habits")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Self Help")
        ).toBeInTheDocument();
    });

    it("renders availability badge", () => {
        render(<BookTable books={books} />);

        expect(
            screen.getByTestId("availability-badge")
        ).toHaveTextContent("available");
    });

    it("renders Enable Auction when there is no auction", () => {
        render(<BookTable books={books} />);

        expect(
            screen.getByRole("button", {
                name: "Enable Auction",
            })
        ).toBeInTheDocument();
    });

    it("opens auction details modal when Enable Auction is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Enable Auction",
            })
        );

        expect(
            screen.getByTestId("auction-details-modal")
        ).toBeInTheDocument();
    });

    it("closes auction details modal", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Enable Auction",
            })
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
                auction: createAuction("live"),
            },
        ];

        render(<BookTable books={liveBooks} />);

        expect(
            screen.getByRole("button", {
                name: "Live auction",
            })
        ).toBeInTheDocument();
    });

    it("shows Upcoming auction for upcoming auction", () => {
    const book = {
        ...baseBook,
        isAuction: true,
        auction: createAuction("upcoming"),
    };

    render(
        <BookTable
            books={[book]}
        />
    );

    expect(
        screen.getByRole("button", {
            name: /upcoming auction/i,
        })
    ).toBeInTheDocument();

    expect(
        screen.queryByRole("button", {
            name: /enable auction/i,
        })
    ).not.toBeInTheDocument();
});

    it("shows Cancelled for cancelled auction", () => {
        const cancelledBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: createAuction("cancelled"),
            },
        ];

        render(<BookTable books={cancelledBooks} />);

        expect(
            screen.getByText("Cancelled")
        ).toBeInTheDocument();
    });

    it("shows Auction Completed when completed auction has no order", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: createAuction("completed"),
            },
        ];

        render(<BookTable books={completedBooks} />);

        expect(
            screen.getByText("Auction Completed")
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: "Live auction",
            })
        ).not.toBeInTheDocument();
    });

    it("shows order status when completed auction has an order", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: createAuction("completed", {
                    _id: "order-1",
                    orderNumber: "ORD-001",
                    orderType: "auction",
                    orderStatus: "pending",
                }),
            },
        ];

        render(<BookTable books={completedBooks} />);

        expect(
            screen.getByText("pending")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Auction Completed")
        ).not.toBeInTheDocument();
    });

    it("does not show Enable Auction for completed auction", () => {
        const completedBooks = [
            {
                ...baseBook,
                isAuction: true,
                auctionId: "auction-1",
                auction: createAuction("completed"),
            },
        ];

        render(<BookTable books={completedBooks} />);

        expect(
            screen.queryByRole("button", {
                name: "Enable Auction",
            })
        ).not.toBeInTheDocument();
    });

    it("calls redirectToEditBook when Edit is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Edit book",
            })
        );

        expect(
            mockRedirectToEditBook
        ).toHaveBeenCalledWith("book-1");
    });

    it("calls redirectToBookDetails when book name is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Atomic Habits",
            })
        );

        expect(
            mockRedirectToBookDetails
        ).toHaveBeenCalledWith(books[0]);
    });

    it("opens delete modal when Delete is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        expect(
            screen.getByTestId("delete-modal")
        ).toBeInTheDocument();
    });

    it("closes delete modal when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Cancel",
            })
        );

        expect(
            screen.queryByTestId("delete-modal")
        ).not.toBeInTheDocument();
    });

    it("calls deleteBook when Confirm Delete is clicked", async () => {
        const user = userEvent.setup();

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm Delete",
            })
        );

        expect(
            mockDeleteBook
        ).toHaveBeenCalledTimes(1);

        expect(
            mockDeleteBook
        ).toHaveBeenCalledWith(
            "book-1",
            expect.any(Object)
        );
    });

    it("renders empty state", () => {
        render(<BookTable books={[]} />);

        expect(
            screen.getByText("No Books Found")
        ).toBeInTheDocument();
    });

    it("does not render any books when empty", () => {
        render(<BookTable books={[]} />);

        expect(
            screen.queryByText("Atomic Habits")
        ).not.toBeInTheDocument();
    });

    it("shows success toast after deleting a book", async () => {
        const user = userEvent.setup();

        mockDeleteBook.mockImplementation(
            (
                _id: string,
                options: DeleteMutationOptions
            ) => {
                options.onSuccess?.();
            }
        );

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm Delete",
            })
        );

        expect(
            mockShowToast
        ).toHaveBeenCalledWith(
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
            (
                _id: string,
                options: DeleteMutationOptions
            ) => {
                options.onError?.({
                    message: "Delete failed",
                });
            }
        );

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm Delete",
            })
        );

        expect(
            mockShowToast
        ).toHaveBeenCalledWith(
            "Delete failed",
            "error"
        );
    });

    it("shows default error message when error has no message", async () => {
        const user = userEvent.setup();

        mockDeleteBook.mockImplementation(
            (
                _id: string,
                options: DeleteMutationOptions
            ) => {
                options.onError?.({});
            }
        );

        render(<BookTable books={books} />);

        await user.click(
            screen.getByRole("button", {
                name: "Delete book",
            })
        );

        await user.click(
            screen.getByRole("button", {
                name: "Confirm Delete",
            })
        );

        expect(
            mockShowToast
        ).toHaveBeenCalledWith(
            "Failed to delete book",
            "error"
        );
    });
});