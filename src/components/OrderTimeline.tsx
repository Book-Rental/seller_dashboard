import { BiCheck } from "react-icons/bi";

type Props = {
    timeline: {
        orderCreated: string;
        shippedDate: string | null;
        outForDeliveryDate: string | null;
        deliveredDate: string | null;
        returnDate?: string | null;
    };
    itemStatus: string;
};

type StepKey = keyof Props["timeline"];

const steps: { key: StepKey; label: string }[] = [
    { key: "orderCreated", label: "Placed" },
    { key: "shippedDate", label: "Shipped" },
    { key: "outForDeliveryDate", label: "Out for Delivery" },
    { key: "deliveredDate", label: "Delivered" },
    { key: "returnDate", label: "Returned" },
];

const STATUS_STEP_INDEX: Record<string, number> = {
    pending: -1,
    confirmed: 0,
    shipped: 1,
    out_for_delivery: 2,
    delivered: 3,
    return_requested: 3,
    returned: 4,
};

const isTerminalNegative = (status: string) =>
    status === "cancelled" || status === "rejected";

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

const OrderTimeline = ({ timeline, itemStatus }: Props) => {
    if (isTerminalNegative(itemStatus)) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <h3 className="text-lg font-semibold text-red-700">
                    Order {itemStatus}
                </h3>
                <p className="mt-2 text-sm text-red-600">
                    The fulfillment timeline was not completed.
                </p>
            </div>
        );
    }

    const currentIndex = STATUS_STEP_INDEX[itemStatus] ?? -1;
    const n = steps.length;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {itemStatus === "return_requested" && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                    Return requested • Awaiting pickup
                </div>
            )}

            <div className="relative">
                {/* connector track sits behind the dot row */}
                <div className="pointer-events-none absolute left-0 right-0 top-[10px] z-0">
                    {steps.slice(0, -1).map((_, index) => {
                        // center of column i is at (i + 0.5) / n * 100%
                        const left = ((index + 0.5) / n) * 100;
                        const width = (1 / n) * 100;
                        const filled = index < currentIndex;
                        return (
                            <div
                                key={index}
                                className={`absolute top-0 h-0.5 transition-colors duration-300 ${filled ? "bg-green-500" : "bg-gray-200"
                                    }`}
                                style={{ left: `${left}%`, width: `${width}%` }}
                            />
                        );
                    })}
                </div>

                {/* dot + label grid — equal columns regardless of label width */}
                <div
                    className="relative z-10 grid"
                    style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                >
                    {steps.map((step, index) => {
                        const hasDate = Boolean(timeline[step.key]);
                        const completed = hasDate || index <= currentIndex;
                        const isCurrent = !completed && index === currentIndex + 1;

                        let statusText: string;
                        if (hasDate) {
                            statusText = formatDate(timeline[step.key] as string);
                        } else if (completed) {
                            statusText = "In transit";
                        } else if (isCurrent) {
                            statusText = "In Progress";
                        } else {
                            statusText = "Pending";
                        }

                        return (
                            <div key={step.key} className="flex flex-col items-center px-1">
                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${completed
                                        ? "border-green-500 bg-green-500"
                                        : isCurrent
                                            ? "border-blue-500 bg-blue-500 ring-4 ring-blue-100 animate-pulse"
                                            : "border-gray-300 bg-white"
                                        }`}
                                >
                                    {completed && <BiCheck size={12} className="text-white" />}
                                </div>

                                <p
                                    className={`mt-3 text-center text-sm font-semibold ${completed || isCurrent ? "text-gray-900" : "text-gray-400"
                                        }`}
                                >
                                    {step.label}
                                </p>

                                <p
                                    className={`mt-0.5 text-center text-xs ${isCurrent
                                        ? "font-medium text-blue-600"
                                        : completed
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {statusText}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderTimeline;