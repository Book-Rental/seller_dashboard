import { Rb_Button, Rb_Text } from "@rentbook/rentbook-ui-lib";
import { useOrders } from "../hooks/useOrders";
import StatusBadge from "../components/StatusBadge";
import { redirectToOrders } from "../utils/navigation";
import { Order } from "../types/order";

const OrderDetails = () => {
    const { data, isLoading } = useOrders();

    const orderId = new URLSearchParams(window.location.search).get("orderId");

    const orders: Order[] = data?.data?.orders ?? [];

    const order = orders.find(
        (item) => item._id === orderId
    );


    if (isLoading) {
        return <Rb_Text>Loading...</Rb_Text>;
    }

    if (!order || !order.items.length) {
        return (
            <div className="p-8">
                <Rb_Text variant="h2">Order not found</Rb_Text>
            </div>
        );
    }

    const book = order.items[0];

    return (
        <div className="min-h-screen p-8 bg-gray-50">

            {/* Header */}

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <button
                        onClick={redirectToOrders}
                        className="mb-2 text-sm text-blue-600 hover:underline"
                    >
                        ← Back to Orders
                    </button>

                    <Rb_Text variant="h1" className="text-3xl font-bold">
                        {order.orderNumber}
                    </Rb_Text>

                </div>

                <StatusBadge status={order.orderStatus} />

            </div>

            {/* Book + Buyer */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Book */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <Rb_Text
                        variant="h2"
                        className="mb-5 text-xl font-semibold"
                    >
                        Book Information
                    </Rb_Text>

                    <div className="flex gap-5">

                        <img
                            src={book.bookId.coverImage}
                            alt={book.bookId.name}
                            className="h-40 w-28 rounded-lg object-cover"
                        />

                        <div>

                            <h3 className="text-xl font-semibold">
                                {book.bookId.name}
                            </h3>

                            <p className="mt-1 text-gray-500">
                                {book.bookId.author}
                            </p>

                            <div className="mt-5 space-y-2">

                                <p>
                                    Rental Price :
                                    <strong> ₹{book.rentalPrice}</strong>
                                </p>

                                <p>
                                    Security Deposit :
                                    <strong> ₹{book.securityDeposit}</strong>
                                </p>

                                <p>
                                    Quantity :
                                    <strong> {book.quantity}</strong>
                                </p>

                                <p>
                                    Order Type :
                                    <strong> {book.orderType}</strong>
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Buyer */}

                <div className="rounded-xl bg-white p-6 shadow-sm">

                    <Rb_Text
                        variant="h2"
                        className="mb-5 text-xl font-semibold"
                    >
                        Buyer Information
                    </Rb_Text>

                    <div className="space-y-4">

                        <div>

                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p>{order.deliveryAddress.name}</p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Phone
                            </p>

                            <p>{order.deliveryAddress.phone}</p>

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Address
                            </p>

                            <p>
                                {order.deliveryAddress.street},
                                {order.deliveryAddress.city},
                                {order.deliveryAddress.state},
                                {order.deliveryAddress.zipCode}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Rental */}

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                <Rb_Text
                    variant="h2"
                    className="mb-5 text-xl font-semibold"
                >
                    Rental Information
                </Rb_Text>

                <div className="grid grid-cols-2 gap-6">

                    <div>

                        <p className="text-sm text-gray-500">
                            Rent Start Date
                        </p>

                        <p>
                            {new Date(
                                book.rentStartDate
                            ).toLocaleDateString("en-GB")}
                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">
                            Expected Return
                        </p>

                        <p>
                            {new Date(
                                book.expectedReturnDate
                            ).toLocaleDateString("en-GB")}
                        </p>

                    </div>

                </div>

            </div>

            {/* Payment */}

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                <Rb_Text
                    variant="h2"
                    className="mb-5 text-xl font-semibold"
                >
                    Payment Summary
                </Rb_Text>

                <div className="space-y-3">

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Security Deposit</span>
                        <span>₹{order.securityDepositTotal}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹{order.deliveryFee}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{order.tax}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>₹{order.discount}</span>
                    </div>

                    <hr />

                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                    </div>

                    <div className="mt-5 flex justify-between">
                        <span>Payment Method</span>
                        <span>{order.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Payment Status</span>
                        <StatusBadge status={order.paymentStatus} />
                    </div>

                </div>

            </div>

            {/* Actions */}

            <div className="mt-8 flex justify-end gap-4">

                <Rb_Button
                    variant="secondary"
                >
                    Reject
                </Rb_Button>

                <Rb_Button>
                    Approve
                </Rb_Button>

            </div>

        </div>
    );
};

export default OrderDetails;