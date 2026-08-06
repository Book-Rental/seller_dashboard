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
        render(<OrderTimeline timeline={timeline} itemStatus="shipped" />);

        expect(screen.getByText("Placed")).toBeInTheDocument();
        expect(screen.getByText("Shipped")).toBeInTheDocument();
        expect(screen.getByText("Delivered")).toBeInTheDocument();
        expect(screen.getByText("Returned")).toBeInTheDocument();
    });

    it("renders formatted dates for completed steps", () => {
        render(<OrderTimeline timeline={timeline} itemStatus="shipped" />);

        expect(
            screen.getByText("July 31, 2026")
        ).toBeInTheDocument();

        expect(
            screen.getByText("August 1, 2026")
        ).toBeInTheDocument();
    });

    it("shows In progress for the current step and Pending for future steps", () => {
        render(<OrderTimeline timeline={timeline} itemStatus="shipped" />);

        // Delivered is the next step after "shipped" -> current step
        expect(screen.getByText("In progress")).toBeInTheDocument();

        // Returned has not started yet -> still Pending
        expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("renders four timeline circles", () => {
        const { container } = render(
            <OrderTimeline timeline={timeline} itemStatus="shipped" />
        );

        const circles = container.querySelectorAll(".rounded-full");

        expect(circles).toHaveLength(4);
    });

    it("renders connector lines colored by completion state", () => {
        const { container } = render(
            <OrderTimeline timeline={timeline} itemStatus="shipped" />
        );

        // Placed -> Shipped and Shipped -> Delivered segments: completed, both green
        // Wait: only Placed->Shipped is fully completed (both ends have dates).
        // Shipped -> Delivered connector reflects the "Delivered" step's own
        // completed state, which is false (no date yet, only "in progress").
        const greenConnectors = container.querySelectorAll(
            ".bg-green-500.h-0\\.5"
        );
        const grayConnectors = container.querySelectorAll(
            ".bg-gray-300.h-0\\.5"
        );

        expect(greenConnectors).toHaveLength(2);
        expect(grayConnectors).toHaveLength(1);
    });

    it("renders return date when provided", () => {
        render(
            <OrderTimeline
                timeline={{
                    ...timeline,
                    returnDate: "2026-08-10T10:00:00.000Z",
                }}
                itemStatus="returned"
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
                itemStatus="shipped"
            />
        );

        // Delivered -> In progress (current step), Returned -> Pending
        expect(screen.getByText("In progress")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("shows the cancelled banner and skips the step timeline entirely", () => {
        render(<OrderTimeline timeline={timeline} itemStatus="cancelled" />);

        expect(screen.getByText(/order cancelled/i)).toBeInTheDocument();
        expect(screen.queryByText("Placed")).not.toBeInTheDocument();
    });
});