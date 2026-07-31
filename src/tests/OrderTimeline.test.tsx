import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderTimeline from "../components/OrderTimeline";

const timeline = {
    orderCreated: "2026-07-31T10:00:00.000Z",
    shippedDate: "2026-08-01T10:00:00.000Z",
    deliveredDate: null,
    returnDate: null,
};

describe("OrderTimeline", () => {
    it("renders all timeline labels", () => {
        render(<OrderTimeline timeline={timeline} />);

        expect(screen.getByText("Placed")).toBeInTheDocument();
        expect(screen.getByText("Shipped")).toBeInTheDocument();
        expect(screen.getByText("Delivered")).toBeInTheDocument();
        expect(screen.getByText("Returned")).toBeInTheDocument();
    });

    it("renders formatted dates for completed steps", () => {
        render(<OrderTimeline timeline={timeline} />);

        expect(
            screen.getByText("July 31, 2026")
        ).toBeInTheDocument();

        expect(
            screen.getByText("August 1, 2026")
        ).toBeInTheDocument();
    });

    it("shows Pending for incomplete steps", () => {
        render(<OrderTimeline timeline={timeline} />);

        const pending = screen.getAllByText("Pending");

        expect(pending).toHaveLength(2);
    });

    it("renders four timeline circles", () => {
        const { container } = render(
            <OrderTimeline timeline={timeline} />
        );

        const circles = container.querySelectorAll(".rounded-full");

        expect(circles).toHaveLength(4);
    });

    it("renders connector lines between steps", () => {
        const { container } = render(
            <OrderTimeline timeline={timeline} />
        );

        const connectors =
            container.querySelectorAll(".bg-gray-300.h-0\\.5");

        expect(connectors).toHaveLength(3);
    });

    it("renders return date when provided", () => {
        render(
            <OrderTimeline
                timeline={{
                    ...timeline,
                    returnDate: "2026-08-10T10:00:00.000Z",
                }}
            />
        );

        expect(
            screen.getByText("August 10, 2026")
        ).toBeInTheDocument();
    });

    it("renders Pending when returnDate is omitted", () => {
        render(
            <OrderTimeline
                timeline={{
                    orderCreated: "2026-07-31T10:00:00.000Z",
                    shippedDate: "2026-08-01T10:00:00.000Z",
                    deliveredDate: null,
                }}
            />
        );

        expect(screen.getAllByText("Pending")).toHaveLength(2);
    });
});