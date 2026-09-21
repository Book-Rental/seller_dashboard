import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import SellerSidebar from "../components/SellerSidebar";

import {
    redirectToDashboard,
    redirectToOrders,
    redirectToMyBooks,
    redirectToAddBook,
} from "../utils/sellerNavigation";

vi.mock("../utils/sellerNavigation", () => ({
    redirectToDashboard: vi.fn(),
    redirectToOrders: vi.fn(),
    redirectToMyBooks: vi.fn(),
    redirectToAddBook: vi.fn(),
}));

describe("SellerSidebar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all sidebar menu items", () => {
        render(<SellerSidebar currentPage="dashboard" />);

        expect(
            screen.getByRole("heading", {
                name: /seller dashboard/i,
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", {
                name: /dashboard/i,
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
    });

    it("highlights the current page", () => {
        render(<SellerSidebar currentPage="seller-orders" />);

        const ordersButton = screen.getByRole("button", {
            name: /orders/i,
        });

        expect(ordersButton).toHaveClass("bg-blue-600");
        expect(ordersButton).toHaveClass("text-white");
    });

    it("calls redirectToDashboard when Dashboard is clicked", async () => {
        const user = userEvent.setup();

        render(<SellerSidebar currentPage="dashboard" />);

        await user.click(
            screen.getByRole("button", {
                name: /dashboard/i,
            })
        );

        expect(redirectToDashboard).toHaveBeenCalledTimes(1);
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

