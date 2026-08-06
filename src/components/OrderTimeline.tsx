type Props = {
    timeline: {
        orderCreated: string;
        shippedDate: string | null;
        deliveredDate: string | null;
        returnDate?: string | null;
    };
    itemStatus: string; // matches OrderDetails["itemStatus"], which is just `string`
};

type StepKey = keyof Props["timeline"];

const steps: { key: StepKey; label: string }[] = [
    { key: "orderCreated", label: "Placed" },
    { key: "shippedDate", label: "Shipped" },
    { key: "deliveredDate", label: "Delivered" },
    { key: "returnDate", label: "Returned" },
];

// Maps status -> index of the furthest step reached in the happy path.
const STATUS_STEP_INDEX: Record<string, number> = {
    pending: -1,
    confirmed: 0,
    shipped: 1,
    delivered: 2,
    return_requested: 2,
    returned: 3,
};

const isTerminalNegative = (status: string) =>
    status === "cancelled" || status === "rejected";

const OrderTimeline = ({ timeline, itemStatus }: Props) => {
    if (isTerminalNegative(itemStatus)) {
        return (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
                <div className="h-3 w-3 shrink-0 rounded-full bg-red-500" />
                <p className="text-sm font-medium text-red-700">
                    Order {itemStatus === "cancelled" ? "cancelled" : "rejected"}
                    {" — "}the fulfillment timeline was not completed.
                </p>
            </div>
        );
    }

    const currentIndex = STATUS_STEP_INDEX[itemStatus] ?? -1;

    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {itemStatus === "return_requested" && (
                <div className="mb-2 w-full rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-700 sm:hidden">
                    Return requested — awaiting pickup
                </div>
            )}

            {steps.map((step, index) => {
                const hasDate = Boolean(timeline[step.key]);
                // Reached this step according to status, even if no date on record
                const reachedByStatus = index <= currentIndex;
                const completed = hasDate || reachedByStatus;
                const isCurrent = !completed && index === currentIndex + 1;

                let statusText: string;
                if (hasDate) {
                    statusText = new Date(
                        timeline[step.key] as string
                    ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    });
                } else if (reachedByStatus) {
                    // Status says this step happened, but no date was recorded
                    statusText = "Completed";
                } else if (isCurrent) {
                    statusText = "In progress";
                } else {
                    statusText = "Pending";
                }

                return (
                    <div
                        key={step.key}
                        className="relative flex flex-1 flex-col items-center"
                    >
                        {/* Connector Line */}
                        {index !== steps.length - 1 && (
                            <div
                                className={`absolute top-2 left-1/2 hidden h-0.5 w-full -translate-y-1/2 sm:block ${
                                    completed ? "bg-green-500" : "bg-gray-300"
                                }`}
                            />
                        )}

                        {/* Circle */}
                        <div
                            className={`relative z-10 h-4 w-4 rounded-full ${
                                completed
                                    ? "bg-green-500"
                                    : isCurrent
                                    ? "animate-pulse bg-blue-500 ring-4 ring-blue-100"
                                    : "bg-gray-300"
                            }`}
                        />

                        {/* Label */}
                        <p
                            className={`mt-3 text-sm font-semibold sm:text-base ${
                                completed || isCurrent
                                    ? "text-gray-900"
                                    : "text-gray-400"
                            }`}
                        >
                            {step.label}
                        </p>

                        {/* Date / status text */}
                        <p className="mt-1 text-center text-xs text-gray-500 sm:text-sm">
                            {statusText}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTimeline;