import { useState } from "react";
import { Rb_Button, Rb_LoadingSpinner, Rb_Text } from "@rentbook/rentbook-ui-lib";
import StatusBadge from "../components/StatusBadge";
import { redirectToOrders } from "../utils/navigation";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { useUpdateOrderStatus } from "../hooks/useUpdateOrderStatus";
import OrderTimeline from "../components/OrderTimeline";

const OrderDetails = () => {
    const orderItemId =
        new URLSearchParams(window.location.search).get("orderItemId") || "";

    const {
        data,
        isLoading,
        isError,
    } = useOrderDetails(orderItemId);

    const order = data?.data;

    const { mutate } = useUpdateOrderStatus();

    const [loadingAction, setLoadingAction] = useState<
        "approve" | "reject" | null
    >(null);

    const handleApprove = () => {
        setLoadingAction("approve");

        mutate(
            {
                orderItemId,
                action: "approve",
            },
            {
                onSettled: () => {
                    setLoadingAction(null);
                },
            }
        );
    };

    const handleReject = () => {
        setLoadingAction("reject");

        mutate(
            {
                orderItemId,
                action: "reject",
            },
            {
                onSettled: () => {
                    setLoadingAction(null);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Rb_LoadingSpinner text="Loading dashboard..." />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Rb_Text variant="h2">
                    Order not found
                </Rb_Text>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

                {/* Header */}

                <div className="mb-8">

                    <button
                        onClick={redirectToOrders}
                        className="mb-4 text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Orders
                    </button>

                    <Rb_Text
                        variant="h1"
                        className="text-2xl font-bold tracking-tight sm:text-3xl"
                    >
                        {order.orderNumber}
                    </Rb_Text>

                </div>

                {/* Main layout: wide content + sticky sidebar */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">

                    {/* Left: main content */}

                    <div className="space-y-6 lg:col-span-2 lg:space-y-8">

                        {/* Book */}

                        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6 lg:p-8">

                            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Rb_Text
                                    variant="h2"
                                    className="text-lg font-semibold sm:text-xl"
                                >
                                    Book Information
                                </Rb_Text>

                                <StatusBadge
                                    status={order.itemStatus}
                                />
                            </div>

                            <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">

                                <img
                                    src={order.book.coverImage}
                                    alt={order.book.name}
                                    className="mx-auto h-40 w-32 shrink-0 rounded-lg object-cover sm:mx-0 sm:h-36 sm:w-28"
                                />

                                <div className="flex-1">

                                    <h3 className="text-xl font-semibold leading-snug sm:text-2xl">
                                        {order.book.name}
                                    </h3>

                                    <p className="mt-1.5 text-gray-600">
                                        {order.book.author}
                                    </p>

                                    <div className="mt-6 space-y-3 text-sm">

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Language</span>
                                            <div className="text-gray-900">{order.book.language}</div>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <span className="pt-0.5 text-gray-600">Edition</span>

                                            <div className="text-gray-900">
                                                {order.book.edition
                                                    ?.split(",")
                                                    .map((part: string, index: number) => (
                                                        <div key={index}>
                                                            {part.trim()}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Rental / Day</span>
                                            <div className="text-gray-900">
                                                ₹{order.book.rentalPricePerDay}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Rental / Week</span>
                                            <div className="text-gray-900">
                                                ₹{order.book.rentalPricePerWeek}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Rental / Month</span>
                                            <div className="text-gray-900">
                                                ₹{order.book.rentalPricePerMonth}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Security Deposit</span>
                                            <div className="text-gray-900">
                                                ₹{order.book.securityDeposit}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Quantity</span>
                                            <div className="text-gray-900">{order.quantity}</div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Timeline */}

                        <div className="rounded-xl bg-white p-8 shadow-sm">

                            <Rb_Text
                                variant="h2"
                                className="mb-8 text-xl font-semibold"
                            >
                                Order Timeline
                            </Rb_Text>

                            <OrderTimeline
                                timeline={order.timeline}
                            />

                        </div>

                        {/* Rental Information */}

                        <div className="rounded-xl bg-white p-8 shadow-sm">

                            <Rb_Text
                                variant="h2"
                                className="mb-7 text-xl font-semibold"
                            >
                                Rental Information
                            </Rb_Text>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Rental Duration
                                    </p>

                                    <p className="mt-1">
                                        {order.rental.rentalDuration} Days
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Quantity
                                    </p>

                                    <p className="mt-1">{order.quantity}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Rent Start Date
                                    </p>

                                    <p className="mt-1">
                                        {new Date(
                                            order.rental.rentStartDate
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Expected Return
                                    </p>

                                    <p className="mt-1">
                                        {new Date(
                                            order.rental.expectedReturnDate
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Actual Return
                                    </p>

                                    <p className="mt-1">
                                        {order.rental.actualReturnDate
                                            ? new Date(
                                                order.rental.actualReturnDate
                                            ).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Late Fee
                                    </p>

                                    <p className="mt-1">
                                        ₹{order.rental.lateFee}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Payment Summary */}

                        <div className="rounded-xl bg-white p-8 shadow-sm">

                            <Rb_Text
                                variant="h2"
                                className="mb-7 text-xl font-semibold"
                            >
                                Payment Summary
                            </Rb_Text>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Rental Amount</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.rentalAmount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Security Deposit</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.securityDeposit}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Quantity</span>

                                    <span className="text-gray-900">
                                        {order.paymentSummary.quantity}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Subtotal</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.subtotal}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Deposit Total</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.depositTotal}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Delivery Fee</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.deliveryFee}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Discount</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.discount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Tax</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.tax}
                                    </span>
                                </div>

                                <hr className="my-2 border-gray-200" />

                                <div className="flex items-center justify-between gap-4 pb-2 text-base font-bold sm:text-lg">

                                    <span>Total Amount</span>

                                    <span>
                                        ₹{order.paymentSummary.totalAmount}
                                    </span>

                                </div>

                                <hr className="my-2 border-gray-200" />

                                <div className="flex justify-between pt-2">

                                    <span className="text-gray-500">Refund Amount</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.refundAmount}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between">

                                    <span className="text-gray-500">Deposit Status</span>

                                    <StatusBadge
                                        status={order.paymentSummary.depositStatus}
                                    />

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">Refunded Amount</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.depositRefundedAmount}
                                    </span>

                                </div>

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-gray-500">Deduction Amount</span>

                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.depositDeductionAmount}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Right: sticky sidebar */}

                    <div className="space-y-6 lg:sticky lg:top-8">

                        {/* Order summary + actions */}

                        <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                            <Rb_Text
                                variant="h2"
                                className="mb-5 text-lg font-semibold"
                            >
                                Order Summary
                            </Rb_Text>

                            <div className="space-y-3 text-sm">

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Quantity</span>
                                    <span className="text-gray-900">{order.quantity}</span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Rental Duration</span>
                                    <span className="text-gray-900">
                                        {order.rental.rentalDuration} Days
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-gray-900">
                                        ₹{order.paymentSummary.totalAmount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Deposit Status</span>
                                    <StatusBadge
                                        status={order.paymentSummary.depositStatus}
                                    />
                                </div>

                            </div>

                            {order.itemStatus === "pending" && (

                                <div className="mt-6 space-y-3">

                                    <Rb_Button
                                        onClick={handleApprove}
                                        disabled={loadingAction !== null}
                                        className="w-full"
                                    >
                                        {loadingAction === "approve"
                                            ? "Approving..."
                                            : "Approve"}
                                    </Rb_Button>

                                    <Rb_Button
                                        variant="secondary"
                                        onClick={handleReject}
                                        disabled={loadingAction !== null}
                                        className="w-full"
                                    >
                                        {loadingAction === "reject"
                                            ? "Rejecting..."
                                            : "Reject"}
                                    </Rb_Button>

                                </div>

                            )}

                        </div>

                        {/* Buyer */}

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <Rb_Text
                                variant="h2"
                                className="mb-5 text-lg font-semibold"
                            >
                                Buyer Information
                            </Rb_Text>

                            <div className="space-y-4 text-sm">

                                <div>
                                    <p className="text-gray-600">
                                        Buyer Name
                                    </p>

                                    <p className="text-gray-900">
                                        {order.buyer.firstName}{" "}
                                        {order.buyer.lastName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-600">
                                        Email
                                    </p>

                                    <p className="mt-1 text-gray-900">{order.buyer.email}</p>
                                </div>

                                <div>
                                    <p className="text-gray-600">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-gray-900">
                                        {order.buyer.shippingAddress.phone}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Shipping Address */}

                        <div className="rounded-xl bg-white p-6 shadow-sm">

                            <Rb_Text
                                variant="h2"
                                className="mb-5 text-lg font-semibold"
                            >
                                Shipping Address
                            </Rb_Text>

                            <div className="space-y-2 break-words text-sm leading-relaxed text-gray-900">
                                {[
                                    order.buyer.shippingAddress.name,
                                    order.buyer.shippingAddress.street,
                                    `${order.buyer.shippingAddress.city}, ${order.buyer.shippingAddress.state}`,
                                    order.buyer.shippingAddress.zipCode,
                                    order.buyer.shippingAddress.country,
                                ].map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderDetails;