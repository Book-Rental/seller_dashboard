import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OrderTable from "../components/OrderTable";

vi.mock("../components/StatusBadge", () => ({
    default: ({ status }: { status: string }) => (
        <span data-testid="status-badge">{status}</span>
    ),
}));

const mockOrders = [
    {
        orderId: "order-1",
        orderItemId: "item-1",
        orderNumber: "ORD-1001",
        bookId: "book-1",
        bookName: "Atomic Habits",
        buyerName: "John Doe",
        rentalPrice: 250,
        status: "Delivered",
        date: "2026-07-31T10:00:00.000Z",
    },
    {
        orderId: "order-2",
        orderItemId: "item-2",
        orderNumber: "ORD-1002",
        bookId: "book-2",
        bookName: "Deep Work",
        buyerName: "Jane Smith",
        rentalPrice: 150,
        status: "Pending",
        date: "2026-08-01T10:00:00.000Z",
    },
];

describe("OrderTable", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all table headers", () => {
        render(<OrderTable orders={mockOrders} />);

        expect(screen.getByText("Order ID")).toBeInTheDocument();
        expect(screen.getByText("Book")).toBeInTheDocument();
        expect(screen.getByText("Buyer")).toBeInTheDocument();
        expect(screen.getByText("Amount")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("renders all orders", () => {
        render(<OrderTable orders={mockOrders} />);

        expect(screen.getByText("ORD-1001")).toBeInTheDocument();
        expect(screen.getByText("ORD-1002")).toBeInTheDocument();

        expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
        expect(screen.getByText("Deep Work")).toBeInTheDocument();

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();

        expect(screen.getByText("₹250")).toBeInTheDocument();
        expect(screen.getByText("₹150")).toBeInTheDocument();
    });

    it("renders StatusBadge for each order", () => {
        render(<OrderTable orders={mockOrders} />);

        const badges = screen.getAllByTestId("status-badge");

        expect(badges).toHaveLength(2);
        expect(badges[0]).toHaveTextContent("Delivered");
        expect(badges[1]).toHaveTextContent("Pending");
    });

    it("formats dates correctly", () => {
        render(<OrderTable orders={mockOrders} />);

        expect(screen.getByText("31/07/2026")).toBeInTheDocument();
        expect(screen.getByText("01/08/2026")).toBeInTheDocument();
    });

    it("calls onView when View button is clicked", async () => {
        const user = userEvent.setup();
        const onView = vi.fn();

        render(
            <OrderTable
                orders={mockOrders}
                onView={onView}
            />
        );

        await user.click(screen.getAllByRole("button", { name: /view/i })[0]);

        expect(onView).toHaveBeenCalledTimes(1);
        expect(onView).toHaveBeenCalledWith(mockOrders[0].orderItemId);
    });

    it("does not throw when onView is not provided", async () => {
        const user = userEvent.setup();

        render(<OrderTable orders={mockOrders} />);

        await user.click(screen.getAllByRole("button", { name: /view/i })[0]);

        expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    });

    it("shows 'No Orders Found' when orders array is empty", () => {
        render(<OrderTable orders={[]} />);

        expect(
            screen.getByText("No Orders Found")
        ).toBeInTheDocument();
    });

    it("does not render order data when orders array is empty", () => {
        render(<OrderTable orders={[]} />);

        expect(screen.queryByText("ORD-1001")).not.toBeInTheDocument();
        expect(screen.queryByText("Atomic Habits")).not.toBeInTheDocument();
    });
});