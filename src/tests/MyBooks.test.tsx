import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyBooks from "../pages/MyBooks";

const {
    mockUseSellerBooks,
    mockRedirectToAddBook,
} = vi.hoisted(() => ({
    mockUseSellerBooks: vi.fn(),
    mockRedirectToAddBook: vi.fn(),
}));

Object.defineProperty(window, "HOST_USER_INFO", {
    writable: true,
    value: {
        _id: "seller-1",
    },
});

vi.mock("../hooks/useSellerBooks", () => ({
    useSellerBooks: mockUseSellerBooks,
}));

vi.mock("../utils/sellerNavigation", () => ({
    redirectToAddBook: mockRedirectToAddBook,
}));

vi.mock("../components/SellerLayout", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children }: any) => (
        <div data-testid="seller-layout">{children}</div>
    ),
}));

type MockBook = {
    _id: string;
    name: string;
};

vi.mock("../components/BookTable", () => ({
    default: ({ books }: { books: MockBook[] }) => (
        <div data-testid="book-table">
            {books.map((book) => (
                <div key={book._id}>{book.name}</div>
            ))}
        </div>
    ),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_Text: ({ children }: any) => <div>{children}</div>,
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>
            {children}
        </button>
    ),
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_LoadingSpinner: ({ text }: any) => (
        <div data-testid="loading-spinner">{text}</div>
    ),
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pagination: ({ currentPage, totalPages }: any) => (
        <div data-testid="pagination">
            {currentPage}/{totalPages}
        </div>
    ),
}));

describe("MyBooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseSellerBooks.mockReturnValue({
            data: {
                data: {
                    books: {
                        books: [
                            {
                                _id: "1",
                                name: "Atomic Habits",
                                availabilityStatus: "available",
                                categoryId: {
                                    name: "Self Help",
                                },
                            },
                            {
                                _id: "2",
                                name: "Clean Code",
                                availabilityStatus: "unavailable",
                                categoryId: {
                                    name: "Programming",
                                },
                            },
                        ],
                        meta: {
                            totalPages: 2,
                            totalRecords: 2,
                        },
                    },
                },
            },
            isLoading: false,
        });
    });

    it("renders page", () => {
        render(<MyBooks />);

        expect(screen.getByText("My Books")).toBeInTheDocument();
        expect(screen.getByText("Total Books: 2")).toBeInTheDocument();
        expect(screen.getByTestId("seller-layout")).toBeInTheDocument();
    });

    it("renders books", () => {
        render(<MyBooks />);

        expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
        expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    it("shows loading spinner", () => {
        mockUseSellerBooks.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<MyBooks />);

        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        expect(screen.getByText("Loading books...")).toBeInTheDocument();
    });

    it("redirects when Add Book button is clicked", async () => {
        const user = userEvent.setup();

        render(<MyBooks />);

        await user.click(
            screen.getByRole("button", {
                name: /\+ Add Book/i,
            })
        );

        expect(mockRedirectToAddBook).toHaveBeenCalledTimes(1);
    });

    it("renders pagination", () => {
        render(<MyBooks />);

        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("does not render pagination when only one page exists", () => {
        mockUseSellerBooks.mockReturnValue({
            data: {
                data: {
                    books: {
                        books: [],
                        meta: {
                            totalPages: 1,
                            totalRecords: 0,
                        },
                    },
                },
            },
            isLoading: false,
        });

        render(<MyBooks />);

        expect(
            screen.queryByTestId("pagination")
        ).not.toBeInTheDocument();
    });

    it("filters books by availability", () => {
        render(<MyBooks />);

        const selects = screen.getAllByRole("combobox");

        fireEvent.change(selects[1], {
            target: {
                value: "available",
            },
        });

        expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
        expect(
            screen.queryByText("Clean Code")
        ).not.toBeInTheDocument();
    });

    it("renders category options", () => {
        render(<MyBooks />);

        expect(screen.getByText("Self Help")).toBeInTheDocument();
        expect(screen.getByText("Programming")).toBeInTheDocument();
    });

    it("shows zero books", () => {
        mockUseSellerBooks.mockReturnValue({
            data: {
                data: {
                    books: {
                        books: [],
                        meta: {
                            totalPages: 0,
                            totalRecords: 0,
                        },
                    },
                },
            },
            isLoading: false,
        });

        render(<MyBooks />);

        expect(screen.getByText("Total Books: 0")).toBeInTheDocument();
    });
});

it("updates category filter", () => {
    mockUseSellerBooks.mockReturnValue({
        data: {
            data: {
                books: {
                    books: [],
                    meta: {
                        totalPages: 0,
                        totalRecords: 0,
                    },
                },
            },
        },
        isLoading: false,
    });

    render(<MyBooks />);

    fireEvent.change(screen.getAllByRole("combobox")[0], {
        target: {
            value: "Programming",
        },
    });

    expect(mockUseSellerBooks).toHaveBeenCalled();
});