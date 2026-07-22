import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useOrders } from "../hooks/useOrders";
import { useDashboard } from "../hooks/useDashboard";
import { redirectToOrderDetails, redirectToOrders } from "../utils/navigation";
import OrderTable from "../components/OrderTable";
import { Order } from "../types/order";


const Dashboard = () => {
    const { data, isLoading } = useOrders();

    const { data: dashboardData } = useDashboard();
    const dashboard = dashboardData?.data;
    const stats = [
        {
            title: "Total Books",
            value: dashboard?.totalBooks ?? 0,
        },
        {
            title: "Active Rentals",
            value: dashboard?.activeOrdersCount ?? 0,
        },
        {
            title: "Total Orders",
            value: dashboard?.totalOrders ?? 0,
        },
        {
            title: "Total Earnings",
            value: `₹${dashboard?.totalEarnings ?? 0}`,
        },
    ];
    const orders: Order[] = data?.data?.orders ?? [];
    const displayedOrders = orders.slice(0, 5);

    return (
        <div className="min-h-screen p-8">
            <Rb_Text
                variant="h1"
                className="mb-8 text-3xl font-bold text-gray-900"
            >
                Dashboard Overview
            </Rb_Text>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border border-black-500 bg-white p-6 text-center shadow-sm"
                    >
                        <Rb_Text
                            variant="p"
                            className="text-sm text-black-500"
                        >
                            {item.title}
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-2 text-3xl font-bold text-gray-900"
                        >
                            {item.value}
                        </Rb_Text>
                    </div>
                ))}
            </div>

            <div className="mt-8 rounded-xl bg-white">
                <Rb_Text
                    variant="h2"
                    className="mb-5 text-xl font-bold text-gray-900"
                >
                    Recent Orders
                </Rb_Text>

                {isLoading ? (
                    <Rb_Text variant="p">Loading...</Rb_Text>
                ) : (
                    <OrderTable
                        orders={displayedOrders}
                        onView={redirectToOrderDetails}
                    />
                )}

                {orders.length > 5 && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={redirectToOrders}
                            className="rounded-md border border-black-500 bg-blue-50 px-8 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                            View All Orders
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;