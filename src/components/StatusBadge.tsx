import { Rb_Text } from "@rentbook/rentbook-ui-lib";

type StatusBadgeProps = {
  status?: string;
};

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status = "" }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();

  return (
    <Rb_Text
      variant="span"
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusClasses[normalizedStatus] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "-"}
    </Rb_Text>
  );
};

export default StatusBadge;