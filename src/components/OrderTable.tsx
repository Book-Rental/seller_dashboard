import { Order } from "../types/order";
import StatusBadge from "./StatusBadge";

type Props = {
    orders: Order[];
    showAction?: boolean;
    onView?: (orderId: string) => void;
};

const OrderTable = ({
    orders,
    showAction = false,
    onView,
}: Props) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full">
                <thead className="bg-blue-50">
                    <tr>
                        <th className="px-6 py-4 text-left">Order ID</th>
                        <th className="px-6 py-4 text-left">Book</th>
                        <th className="px-6 py-4 text-left">Buyer</th>
                        <th className="px-6 py-4 text-left">Amount</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-left">Date</th>   
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                        <tr>
                            <td
                                colSpan={showAction ? 7 : 6}
                                className="py-8 text-center text-gray-500"
                            >
                                No Orders Found
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => {
                            const item = order.items?.[0];

                            return (
                                <tr
                                    key={order._id}
                                    className={`hover:bg-gray-50 ${onView ? "cursor-pointer" : ""
                                        }`}
                                    onClick={() => onView?.(order._id)}
                                >
                                    <td className="px-6 py-4">
                                        {order.orderNumber}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item?.bookId?.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.deliveryAddress?.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        ₹{order.total}
                                    </td>

                                    <td className="px-6 py-4">
                                        <StatusBadge
                                            status={order.orderStatus}
                                        />
                                    </td>

                                    <td className="px-6 py-4">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {showAction && (
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() =>
                                                    onView?.(order._id)
                                                }
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                View →
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;