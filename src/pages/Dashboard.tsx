import { Rb_LoadingSpinner, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useDashboard } from "../hooks/useDashboard";
import { useRecentOrders } from "../hooks/useRecentOrders";
import RecentOrdersTable from "../components/RecentOrdersTable";
import { RecentOrder } from "../types/order";
import SellerLayout from "../components/SellerLayout";
import { redirectToOrderDetails, redirectToOrders } from "../utils/sellerNavigation";


const Dashboard = () => {
    const { data: dashboardData } = useDashboard();

    const { data, isLoading } = useRecentOrders();

    const dashboard = dashboardData?.data;

    const stats = [
        {
            title: "Total Books",
            value: dashboard?.totalBooks ?? 0,
        },
        {
            title: "Active Orders",
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

    const recentOrders: RecentOrder[] =
        data?.data?.orders ?? [];

    return (
        <SellerLayout currentPage="dashboard">
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <Rb_Text
                variant="h1"
                className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl"
            >
                Dashboard Overview
            </Rb_Text>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border bg-white p-5 text-center shadow-sm sm:p-6"
                    >
                        <Rb_Text
                            variant="p"
                            className="text-sm text-gray-500"
                        >
                            {item.title}
                        </Rb_Text>

                        <Rb_Text
                            variant="h2"
                            className="mt-2 text-2xl font-bold sm:text-3xl"
                        >
                            {item.value}
                        </Rb_Text>
                    </div>
                ))}
            </div>

            <div className="mt-8 sm:mt-10">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Rb_Text
                        variant="h2"
                        className="text-lg font-bold sm:text-xl"
                    >
                        Recent Orders
                    </Rb_Text>

                    <button
                        onClick={redirectToOrders}
                        className="self-start text-sm font-medium text-blue-600 hover:underline sm:self-auto"
                    >
                        View All
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Rb_LoadingSpinner text="Loading dashboard..." />
                    </div>
                ) : (
                    <RecentOrdersTable
                        orders={recentOrders}
                        onView={redirectToOrderDetails}
                    />
                )}
            </div>
        </div>
        </SellerLayout>
    );
};

export default Dashboard;