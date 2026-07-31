import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AddBook from "../pages/AddBook";

const {
    mockUseBookById,
} = vi.hoisted(() => ({
    mockUseBookById: vi.fn(),
}));

vi.mock("../hooks/useBookById", () => ({
    useBookById: mockUseBookById,
}));

vi.mock("../components/SellerLayout", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children }: any) => (
        <div data-testid="seller-layout">{children}</div>
    ),
}));

vi.mock("../components/BookForm", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ mode, bookId, initialData }: any) => (
        <div data-testid="book-form">
            <span>{mode}</span>
            <span>{bookId}</span>
            <span>{initialData?.name}</span>
        </div>
    ),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_LoadingSpinner: () => (
        <div data-testid="loading-spinner">Loading...</div>
    ),
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_Text: ({ children }: any) => <div>{children}</div>,
}));

describe("AddBook", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders create mode", () => {
        mockUseBookById.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            error: null,
        });

        render(<AddBook />);

        expect(screen.getByTestId("seller-layout")).toBeInTheDocument();
        expect(screen.getByTestId("book-form")).toBeInTheDocument();
        expect(screen.getByText("create")).toBeInTheDocument();
    });

    it("shows loading spinner in edit mode", () => {
        mockUseBookById.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            error: null,
        });

        render(
            <AddBook
                mode="edit"
                bookId="book-1"
            />
        );

        expect(
            screen.getByTestId("loading-spinner")
        ).toBeInTheDocument();
    });

    it("shows error message when loading book fails", () => {
        mockUseBookById.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: new Error("Failed to fetch book"),
        });

        render(
            <AddBook
                mode="edit"
                bookId="book-1"
            />
        );

        expect(
            screen.getByText("Failed to fetch book")
        ).toBeInTheDocument();
    });

    it("renders BookForm with edit mode and initial data", () => {
        mockUseBookById.mockReturnValue({
            data: {
                data: {
                    name: "Atomic Habits",
                },
            },
            isLoading: false,
            isError: false,
            error: null,
        });

        render(
            <AddBook
                mode="edit"
                bookId="book-1"
            />
        );

        expect(screen.getByTestId("book-form")).toBeInTheDocument();
        expect(screen.getByText("edit")).toBeInTheDocument();
        expect(screen.getByText("book-1")).toBeInTheDocument();
        expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    });

    it("shows fallback error message when error is not an Error object", () => {
        mockUseBookById.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            error: "Some unknown error",
        });

        render(
            <AddBook
                mode="edit"
                bookId="book-1"
            />
        );

        expect(
            screen.getByText("Failed to load book")
        ).toBeInTheDocument();
    });
});