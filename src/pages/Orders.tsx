import { useMemo, useState } from "react";
import {
    Pagination,
    Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import OrderTable from "../components/OrderTable";
import { useOrders } from "../hooks/useOrders";
import { SellerOrder } from "../types/order";
import { redirectToOrderDetails } from "../utils/navigation";

const Orders = () => {
    const [page, setPage] = useState(1);
    const [selectedFilter, setSelectedFilter] =
        useState("All");
    const [search, setSearch] = useState("");

    const { data, isLoading } = useOrders(page);

    const meta = data?.data?.meta;
    const totalPages = meta?.totalPages ?? 0;

    const orders: SellerOrder[] =
        data?.data?.orders ?? [];

    const statusFilters = [
        {
            label: "All",
            count: orders.length,
        },
        {
            label: "Active",
            count: orders.filter(
                (o) =>
                    o.status === "pending" ||
                    o.status === "confirmed"
            ).length,
        },
        {
            label: "Shipped",
            count: orders.filter(
                (o) => o.status === "shipped"
            ).length,
        },
        {
            label: "Delivered",
            count: orders.filter(
                (o) => o.status === "delivered"
            ).length,
        },
        {
            label: "Returned",
            count: orders.filter(
                (o) => o.status === "returned"
            ).length,
        },
    ];

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.orderNumber
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                selectedFilter === "All"
                    ? true
                    : selectedFilter === "Active"
                        ? order.status === "pending" ||
                        order.status === "confirmed"
                        : order.status.toLowerCase() ===
                        selectedFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        orders,
        search,
        selectedFilter,
    ]);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
                <Rb_Text
                    variant="h1"
                    className="text-2xl font-bold sm:text-3xl"
                >
                    Orders
                </Rb_Text>

                <Rb_Text
                    variant="p"
                    className="mt-1 text-sm text-gray-500 sm:text-base"
                >
                    Total Orders :{" "}
                    {filteredOrders.length}
                </Rb_Text>
            </div>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {statusFilters.map(
                        (status) => (
                            <button
                                key={
                                    status.label
                                }
                                onClick={() =>
                                    setSelectedFilter(
                                        status.label
                                    )
                                }
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${selectedFilter ===
                                        status.label
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100"
                                    }`}
                            >
                                {status.label} (
                                {status.count})
                            </button>
                        )
                    )}
                </div>

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search Order ID..."
                    className="w-full rounded-lg border px-4 py-2 lg:w-72"
                />
            </div>

            <div className="min-h-[520px]">
                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {Array.from({
                            length: 8,
                        }).map(
                            (_, index) => (
                                <div
                                    key={
                                        index
                                    }
                                    className="h-14 rounded-lg bg-gray-100"
                                />
                            )
                        )}
                    </div>
                ) : (
                    <OrderTable
                        orders={
                            filteredOrders
                        }
                        onView={
                            redirectToOrderDetails
                        }
                    />
                )}
            </div>

            {totalPages > 1 && (
                <div className="seller-pagination mt-6 flex justify-center sm:mt-8">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        siblingCount={1}
                        disabled={isLoading}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default Orders;