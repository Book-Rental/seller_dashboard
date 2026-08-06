import { FiCheckCircle } from "react-icons/fi";

export type TimelineItem = {
  label: string;
  date?: string;
  description?: string;
};

type ProgressTimelineProps = {
  timeline: TimelineItem[];
};

const ProgressTimeline = ({ timeline }: ProgressTimelineProps) => {
  return (
    <div className="mt-5">
      {timeline.map((step, index) => {
        const completed = Boolean(step.date);
        const isLast = index === timeline.length - 1;

        return (
          <div key={step.label} className="relative flex gap-4">
            {!isLast && (
              <div
                className={`absolute left-[9px] top-5 h-full w-px ${
                  completed ? "bg-blue-400" : "bg-gray-200"
                }`}
              />
            )}

            <div
              className={`relative z-0 flex h-5 w-5 items-center justify-center rounded-full ${
                completed ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              {completed && (
                <FiCheckCircle className="h-3.5 w-3.5 text-white" />
              )}
            </div>

            <div className="pb-6">
              <p
                className={
                  completed
                    ? "text-sm font-semibold text-gray-900"
                    : "text-sm font-semibold text-gray-400"
                }
              >
                {step.label}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {step.date ? new Date(step.date).toLocaleString() : "Pending"}
              </p>

              {step.description && (
                <p className="mt-1 text-xs font-medium text-sky-600">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTimeline;