import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SellerLayout from "../components/SellerLayout";


vi.mock("../components/SellerSidebar", () => ({
    default: ({ currentPage }: { currentPage: string }) => (
        <div data-testid="seller-sidebar">
            Sidebar - {currentPage}
        </div>
    ),
}));


describe("SellerLayout", () => {
    it("renders the SellerSidebar with the correct currentPage", () => {
        render(
            <SellerLayout currentPage="dashboard">
                <div>Dashboard Content</div>
            </SellerLayout>
        );

        expect(
            screen.getByTestId("seller-sidebar")
        ).toHaveTextContent("Sidebar - dashboard");
    });

    it("renders its children inside the layout", () => {
        render(
            <SellerLayout currentPage="seller-orders">
                <div>Orders Page</div>
            </SellerLayout>
        );

        expect(
            screen.getByText("Orders Page")
        ).toBeInTheDocument();
    });

    it("renders both sidebar and children together", () => {
        render(
            <SellerLayout currentPage="seller-my-books">
                <p>My Books Content</p>
            </SellerLayout>
        );

        expect(
            screen.getByTestId("seller-sidebar")
        ).toBeInTheDocument();

        expect(
            screen.getByText("My Books Content")
        ).toBeInTheDocument();
    });
});