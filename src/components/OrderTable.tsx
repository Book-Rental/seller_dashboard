import { SellerOrder } from "../types/order";
import StatusBadge from "./StatusBadge";

type Props = {
    orders: SellerOrder[];
    onView?: (orderItemId: string) => void;
};

const OrderTable = ({
    orders,
    onView,
}: Props) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-[900px] w-full">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Order ID
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Book
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Buyer
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Amount
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Status
                        </th>

                        <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Date
                        </th>

                        <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700 sm:px-6 sm:py-4">
                            Action
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-10 text-center text-gray-500"
                            >
                                No Orders Found
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr
                                key={order.orderItemId}
                                className="hover:bg-gray-50"
                            >
                                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-6 sm:py-4">
                                    {order.orderNumber}
                                </td>

                                <td className="min-w-[180px] px-3 py-3 text-sm sm:px-6 sm:py-4">
                                    <span className="line-clamp-2">
                                        {order.bookName}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-6 sm:py-4">
                                    {order.buyerName}
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-6 sm:py-4">
                                    ₹{order.rentalPrice}
                                </td>

                                <td className="px-3 py-3 sm:px-6 sm:py-4">
                                    <StatusBadge
                                        status={order.status}
                                    />
                                </td>

                                <td className="whitespace-nowrap px-3 py-3 text-sm sm:px-6 sm:py-4">
                                    {new Date(
                                        order.date
                                    ).toLocaleDateString(
                                        "en-GB"
                                    )}
                                </td>

                                <td className="px-3 py-3 text-center sm:px-6 sm:py-4">
                                    <button
                                        onClick={() =>
                                            onView?.(
                                                order.orderItemId
                                            )
                                        }
                                        className="whitespace-nowrap text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        View →
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;