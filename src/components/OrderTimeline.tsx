type Props = {
    timeline: {
        orderCreated: string;
        shippedDate: string | null;
        deliveredDate: string | null;
        returnDate?: string | null;
    };
};

const steps = [
    {
        key: "orderCreated",
        label: "Placed",
    },
    {
        key: "shippedDate",
        label: "Shipped",
    },
    {
        key: "deliveredDate",
        label: "Delivered",
    },
    {
        key: "returnDate",
        label: "Returned",
    },
];

const OrderTimeline = ({ timeline }: Props) => {
    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {steps.map((step, index) => {
                const completed = Boolean(
                    timeline[step.key as keyof typeof timeline]
                );

                return (
                    <div
                        key={step.key}
                        className="relative flex flex-1 flex-col items-center"
                    >
                        {/* Connector Line */}
                        {index !== steps.length - 1 && (
                            <div className="absolute top-2 left-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-gray-300 sm:block" />
                        )}

                        {/* Circle */}
                        <div
                            className={`relative z-10 h-4 w-4 rounded-full ${
                                completed
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                        />

                        {/* Label */}
                        <p className="mt-3 text-sm font-semibold text-gray-900 sm:text-base">
                            {step.label}
                        </p>

                        {/* Date */}
                        <p className="mt-1 text-center text-xs text-gray-500 sm:text-sm">
                            {timeline[
                                step.key as keyof typeof timeline
                            ]
                                ? new Date(
                                      timeline[
                                          step.key as keyof typeof timeline
                                      ] as string
                                  ).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                  })
                                : "Pending"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderTimeline;