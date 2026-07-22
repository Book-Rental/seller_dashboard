import { Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useMemo, useState } from "react";
import OrderTable from "../components/OrderTable";
import { useOrders } from "../hooks/useOrders";
import { redirectToOrderDetails } from "../utils/navigation";
import { Order } from "../types/order";



const Orders = () => {
    const { data, isLoading } = useOrders();

    const [selectedFilter, setSelectedFilter] = useState("All");
    const [search, setSearch] = useState("");
    const orders: Order[] = data?.data?.orders ?? [];
    const statusFilters = [
        {
            label: "All",
            count: orders.length,
        },
        {
            label: "Pending",
            count: orders.filter(
                (order) => order.orderStatus === "pending"
            ).length,
        },
        {
            label: "Approved",
            count: orders.filter(
                (order) => order.orderStatus === "approved"
            ).length,
        },
        {
            label: "Rejected",
            count: orders.filter(
                (order) => order.orderStatus === "rejected"
            ).length,
        },
    ];
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesStatus =
                selectedFilter === "All" ||
                order.orderStatus.toLowerCase() ===
                selectedFilter.toLowerCase();

            const matchesSearch =
                order.orderNumber
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesStatus && matchesSearch;
        });
    }, [orders, selectedFilter, search]);

    const handleView = (orderId: string) => {
        redirectToOrderDetails(orderId);
    };

    return (
        <div className="min-h-screen p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Rb_Text
                        variant="h1"
                        className="text-3xl font-bold"
                    >
                        Orders
                    </Rb_Text>

                    <Rb_Text
                        variant="p"
                        className="mt-1 text-gray-500"
                    >
                        Total Orders: {filteredOrders.length}
                    </Rb_Text>
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-4">
                    {statusFilters.map((status) => (
                        <button
                            key={status.label}
                            onClick={() => setSelectedFilter(status.label)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition ${selectedFilter === status.label
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {status.label} ({status.count})
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Order ID..."
                    className="w-72 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
            </div>

            {isLoading ? (
                <Rb_Text>Loading...</Rb_Text>
            ) : (
                <>
                    {filteredOrders.length === 0 && (
                        <Rb_Text
                            variant="p"
                            className="mb-4 text-sm text-gray-500"
                        >
                            No orders match your search or selected filter.
                        </Rb_Text>
                    )}

                    <OrderTable
                        orders={filteredOrders}
                        showAction
                        onView={handleView}
                    />
                </>
            )}
        </div>
    );
};

export default Orders;