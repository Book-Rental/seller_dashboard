import { Rb_Text } from "@rentbook/rentbook-ui-lib";

type Props = {
    status: string;
};

const statusClasses: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    unavailable: "bg-red-100 text-red-700",
    outofstock: "bg-red-100 text-red-700",
    inactive: "bg-gray-100 text-gray-700",
};

const AvailabilityBadge = ({ status }: Props) => {
    const normalizedStatus = status
        ?.replace(/\s+/g, "")
        .toLowerCase();

    return (
        <Rb_Text
            variant="span"
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusClasses[normalizedStatus] ??
                "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </Rb_Text>
    );
};

export default AvailabilityBadge;