import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Orders from "../pages/Orders";

const {
    mockUseOrders,
    mockRedirectToOrderDetails,
} = vi.hoisted(() => ({
    mockUseOrders: vi.fn(),
    mockRedirectToOrderDetails: vi.fn(),
}));

vi.mock("../hooks/useOrders", () => ({
    useOrders: mockUseOrders,
}));

vi.mock("../utils/sellerNavigation", () => ({
    redirectToOrderDetails: mockRedirectToOrderDetails,
}));

vi.mock("../components/SellerLayout", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children }: any) => (
        <div data-testid="seller-layout">{children}</div>
    ),
}));

type MockOrder = {
    orderId: string;
    orderNumber: string;
};

vi.mock("../components/OrderTable", () => ({
    default: ({ orders }: { orders: MockOrder[] }) => (
        <div data-testid="order-table">
            {orders.map((order) => (
                <div key={order.orderId}>
                    {order.orderNumber}
                </div>
            ))}
        </div>
    ),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_Text: ({ children }: any) => <div>{children}</div>,
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Pagination: ({ currentPage, totalPages }: any) => (
        <div data-testid="pagination">
            {currentPage}/{totalPages}
        </div>
    ),
}));

describe("Orders", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseOrders.mockReturnValue({
            data: {
                data: {
                    orders: [
                        {
                            orderId: "1",
                            orderNumber: "ORD001",
                            status: "pending",
                        },
                        {
                            orderId: "2",
                            orderNumber: "ORD002",
                            status: "confirmed",
                        },
                        {
                            orderId: "3",
                            orderNumber: "ORD003",
                            status: "shipped",
                        },
                        {
                            orderId: "4",
                            orderNumber: "ORD004",
                            status: "delivered",
                        },
                    ],
                    meta: {
                        totalPages: 2,
                    },
                },
            },
            isLoading: false,
        });
    });

    it("renders page title", () => {
        render(<Orders />);

        expect(screen.getByText("Orders")).toBeInTheDocument();
        expect(screen.getByTestId("seller-layout")).toBeInTheDocument();
    });

    it("renders total orders", () => {
        render(<Orders />);

        expect(
            screen.getByText((_, element) =>
                element?.textContent === "Total Orders : 4"
            )
        ).toBeInTheDocument();
    });

    it("renders status filter buttons", () => {
        render(<Orders />);

        expect(screen.getByRole("button", { name: /All/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Active/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Shipped/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Delivered/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Returned/i })).toBeInTheDocument();
    });

    it("filters orders by search", () => {
        render(<Orders />);

        fireEvent.change(
            screen.getByPlaceholderText("Search Order ID..."),
            {
                target: {
                    value: "ORD003",
                },
            }
        );

        expect(screen.getByText("ORD003")).toBeInTheDocument();
        expect(screen.queryByText("ORD001")).not.toBeInTheDocument();
    });

    it("filters active orders", async () => {
        const user = userEvent.setup();

        render(<Orders />);

        await user.click(
            screen.getByRole("button", {
                name: /Active/i,
            })
        );

        expect(screen.getByText("ORD001")).toBeInTheDocument();
        expect(screen.getByText("ORD002")).toBeInTheDocument();
        expect(screen.queryByText("ORD003")).not.toBeInTheDocument();
    });

    it("shows loading skeleton", () => {
        mockUseOrders.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        const { container } = render(<Orders />);

        expect(
            container.querySelector(".animate-pulse")
        ).toBeInTheDocument();
    });

    it("renders order table", () => {
        render(<Orders />);

        expect(
            screen.getByTestId("order-table")
        ).toBeInTheDocument();
    });

    it("renders pagination", () => {
        render(<Orders />);

        expect(
            screen.getByTestId("pagination")
        ).toBeInTheDocument();

        expect(screen.getByText("1/2")).toBeInTheDocument();
    });

    it("hides pagination when only one page exists", () => {
        mockUseOrders.mockReturnValue({
            data: {
                data: {
                    orders: [],
                    meta: {
                        totalPages: 1,
                    },
                },
            },
            isLoading: false,
        });

        render(<Orders />);

        expect(
            screen.queryByTestId("pagination")
        ).not.toBeInTheDocument();
    });

    it("shows zero orders", () => {
        mockUseOrders.mockReturnValue({
            data: {
                data: {
                    orders: [],
                    meta: {
                        totalPages: 0,
                    },
                },
            },
            isLoading: false,
        });

        render(<Orders />);

        expect(
            screen.getByText((_, element) =>
                element?.textContent === "Total Orders : 0"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("order-table")
        ).toBeInTheDocument();
    });
});