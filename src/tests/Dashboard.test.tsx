import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "../pages/Dashboard";

const {
    mockUseDashboard,
    mockUseRecentOrders,
    mockRedirectToOrders,
    mockRedirectToOrderDetails,
} = vi.hoisted(() => ({
    mockUseDashboard: vi.fn(),
    mockUseRecentOrders: vi.fn(),
    mockRedirectToOrders: vi.fn(),
    mockRedirectToOrderDetails: vi.fn(),
}));

vi.mock("../hooks/useDashboard", () => ({
    useDashboard: mockUseDashboard,
}));

vi.mock("../hooks/useRecentOrders", () => ({
    useRecentOrders: mockUseRecentOrders,
}));

vi.mock("../utils/sellerNavigation", () => ({
    redirectToOrders: mockRedirectToOrders,
    redirectToOrderDetails: mockRedirectToOrderDetails,
}));

vi.mock("../components/SellerLayout", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children }: any) => (
        <div data-testid="seller-layout">{children}</div>
    ),
}));

vi.mock("../components/RecentOrdersTable", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ orders }: any) => (
        <div data-testid="recent-orders-table">
            {orders.length} Orders
        </div>
    ),
}));

vi.mock("@rentbook/rentbook-ui-lib", () => ({
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_Text: ({ children }: any) => <div>{children}</div>,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Rb_LoadingSpinner: ({ text }: any) => (
        <div data-testid="loading-spinner">{text}</div>
    ),
}));

describe("Dashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseDashboard.mockReturnValue({
            data: {
                data: {
                    totalBooks: 10,
                    activeOrdersCount: 5,
                    totalOrders: 20,
                    totalEarnings: 5000,
                },
            },
        });

        mockUseRecentOrders.mockReturnValue({
            data: {
                data: {
                    orders: [
                        {
                            orderId: "1",
                        },
                        {
                            orderId: "2",
                        },
                    ],
                },
            },
            isLoading: false,
        });
    });

    it("renders dashboard overview", () => {
        render(<Dashboard />);

        expect(
            screen.getByText("Dashboard Overview")
        ).toBeInTheDocument();

        expect(
            screen.getByTestId("seller-layout")
        ).toBeInTheDocument();
    });

    it("renders dashboard statistics", () => {
        render(<Dashboard />);

        expect(screen.getByText("Total Books")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();

        expect(screen.getByText("Active Orders")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();

        expect(screen.getByText("Total Orders")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();

        expect(screen.getByText("Total Earnings")).toBeInTheDocument();
        expect(screen.getByText("₹5000")).toBeInTheDocument();
    });

    it("shows loading spinner while recent orders are loading", () => {
        mockUseRecentOrders.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<Dashboard />);

        expect(
            screen.getByTestId("loading-spinner")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Loading dashboard...")
        ).toBeInTheDocument();
    });

    it("renders recent orders table", () => {
        render(<Dashboard />);

        expect(
            screen.getByTestId("recent-orders-table")
        ).toBeInTheDocument();

        expect(
            screen.getByText("2 Orders")
        ).toBeInTheDocument();
    });

    it("redirects when View All is clicked", async () => {
        const user = userEvent.setup();

        render(<Dashboard />);

        await user.click(
            screen.getByRole("button", {
                name: "View All",
            })
        );

        expect(mockRedirectToOrders).toHaveBeenCalledTimes(1);
    });

    it("renders zero values when dashboard data is unavailable", () => {
        mockUseDashboard.mockReturnValue({
            data: undefined,
        });

        render(<Dashboard />);

        expect(screen.getAllByText("0")).toHaveLength(3);
        expect(screen.getByText("₹0")).toBeInTheDocument();
    });
});