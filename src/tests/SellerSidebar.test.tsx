import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import SellerSidebar from "../components/SellerSidebar";

import {
    redirectToOrders,
    redirectToMyBooks,
    redirectToAddBook,
} from "../utils/sellerNavigation";

vi.mock("../utils/sellerNavigation", () => ({
    redirectToOrders: vi.fn(),
    redirectToMyBooks: vi.fn(),
    redirectToAddBook: vi.fn(),
}));

describe("SellerSidebar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the sidebar heading and menu items", () => {
        render(<SellerSidebar currentPage="dashboard" />);

        expect(
            screen.getByRole("heading", {
                name: /seller dashboard/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /orders/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /my books/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /add book/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.queryByRole("button", {
                name: /dashboard/i,
            })
        ).not.toBeInTheDocument();
    });

    it("highlights the current page", () => {
        render(<SellerSidebar currentPage="seller-orders" />);

        const ordersButton = screen.getByRole("button", {
            name: /orders/i,
        });

        expect(ordersButton).toHaveClass("bg-blue-600");
        expect(ordersButton).toHaveClass("text-white");
    });

    it("highlights My Books when current page is seller-my-books", () => {
        render(<SellerSidebar currentPage="seller-my-books" />);

        const myBooksButton = screen.getByRole("button", {
            name: /my books/i,
        });

        expect(myBooksButton).toHaveClass("bg-blue-600");
        expect(myBooksButton).toHaveClass("text-white");
    });

    it("highlights Add Book when current page is seller-add-book", () => {
        render(<SellerSidebar currentPage="seller-add-book" />);

        const addBookButton = screen.getByRole("button", {
            name: /add book/i,
        });

        expect(addBookButton).toHaveClass("bg-blue-600");
        expect(addBookButton).toHaveClass("text-white");
    });

    it("calls redirectToOrders when Orders is clicked", async () => {
        const user = userEvent.setup();

        render(<SellerSidebar currentPage="dashboard" />);

        await user.click(
            screen.getByRole("button", {
                name: /orders/i,
            })
        );

        expect(redirectToOrders).toHaveBeenCalledTimes(1);
    });

    it("calls redirectToMyBooks when My Books is clicked", async () => {
        const user = userEvent.setup();

        render(<SellerSidebar currentPage="dashboard" />);

        await user.click(
            screen.getByRole("button", {
                name: /my books/i,
            })
        );

        expect(redirectToMyBooks).toHaveBeenCalledTimes(1);
    });

    it("calls redirectToAddBook when Add Book is clicked", async () => {
        const user = userEvent.setup();

        render(<SellerSidebar currentPage="dashboard" />);

        await user.click(
            screen.getByRole("button", {
                name: /add book/i,
            })
        );

        expect(redirectToAddBook).toHaveBeenCalledTimes(1);
    });
});
