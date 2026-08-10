import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookTable from "../components/BookTable";

const {
    mockDeleteBook,
    mockRedirectToEditBook,
    mockShowToast,
} = vi.hoisted(() => ({
    mockDeleteBook: vi.fn(),
    mockRedirectToEditBook: vi.fn(),
    mockShowToast: vi.fn(),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({
        children,
        onClick,
        disabled,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => (
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) =>
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
}));

const books = [
    {
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
        isAvailable: true,
        isActive: true,
        createdAt: "2026-07-31T10:00:00.000Z",
        updatedAt: "2026-07-31T10:00:00.000Z",
    },
];

describe("BookTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders table headers", () => {
        render(<BookTable books={books} />);

        expect(screen.getByText("Book")).toBeInTheDocument();
        expect(
            screen.getByText("Category")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Price / Week")
        ).toBeInTheDocument();
        expect(screen.getByText("Stock")).toBeInTheDocument();
        expect(
            screen.getByText("Availability")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Auction")
        ).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders book details", () => {
        render(<BookTable books={books} />);

        expect(screen.getByText("₹250")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
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

    it("renders auction as disabled by default", () => {
        render(<BookTable books={books} />);

        expect(
            screen.getByRole("button", {
                name: "Enable auction",
            })
        ).toBeInTheDocument();
    });

    it("toggles auction from disabled to enabled", async () => {
        const user = userEvent.setup();
        const mockToggleAuction = vi.fn();

        render(
            <BookTable
                books={books}
                auctionStatus={{
                    "book-1": false,
                }}
                onToggleAuction={mockToggleAuction}
            />
        );

        await user.click(
            screen.getByRole("button", {
                name: "Enable auction",
            })
        );

        expect(mockToggleAuction).toHaveBeenCalledWith(
            "book-1"
        );
    });

    it("renders auction as enabled when status is true", () => {
        render(
            <BookTable
                books={books}
                auctionStatus={{
                    "book-1": true,
                }}
                onToggleAuction={vi.fn()}
            />
        );

        expect(
            screen.getByRole("button", {
                name: "Disable auction",
            })
        ).toBeInTheDocument();
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

        expect(mockDeleteBook).toHaveBeenCalledTimes(1);
        expect(mockDeleteBook).toHaveBeenCalledWith(
            "book-1",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDeleteBook.mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_id, options: any) => {
                options.onSuccess();
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDeleteBook.mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_id, options: any) => {
                options.onError({
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

        expect(mockShowToast).toHaveBeenCalledWith(
            "Delete failed",
            "error"
        );
    });

    it("shows default error message when error has no message", async () => {
        const user = userEvent.setup();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDeleteBook.mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_id, options: any) => {
                options.onError({});
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

        expect(mockShowToast).toHaveBeenCalledWith(
            "Failed to delete book",
            "error"
        );
    });
});