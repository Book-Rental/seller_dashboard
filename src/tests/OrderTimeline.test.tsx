import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderTimeline from "../components/OrderTimeline";

const timeline = {
    orderCreated: "2026-07-31T10:00:00.000Z",
    shippedDate: "2026-08-01T10:00:00.000Z",
    outForDeliveryDate: null,
    deliveredDate: null,
    returnDate: null,
};

describe("OrderTimeline", () => {
    it("renders all timeline labels", () => {
        render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="shipped"
            />
        );

        expect(screen.getByText("Placed")).toBeInTheDocument();
        expect(screen.getByText("Shipped")).toBeInTheDocument();
        expect(
            screen.getByText("Out for Delivery")
        ).toBeInTheDocument();
        expect(screen.getByText("Delivered")).toBeInTheDocument();
        expect(screen.getByText("Returned")).toBeInTheDocument();
    });

    it("renders formatted dates for completed steps", () => {
        render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="shipped"
            />
        );

        expect(
            screen.getByText("July 31, 2026")
        ).toBeInTheDocument();

        expect(
            screen.getByText("August 1, 2026")
        ).toBeInTheDocument();
    });

    it("shows Out for Delivery as the current step after shipping", () => {
        render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="shipped"
            />
        );

        expect(
            screen.getByText("Out for Delivery")
        ).toBeInTheDocument();

        expect(
            screen.getByText("In Progress")
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("Pending")
        ).toHaveLength(2);
    });

    it("renders connector lines colored by completion state", () => {
        const { container } = render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="shipped"
            />
        );

        const greenConnectors =
            container.querySelectorAll(
                ".bg-green-500.h-0\\.5"
            );

        const grayConnectors =
            container.querySelectorAll(
                ".bg-gray-200.h-0\\.5"
            );

        // Placed -> Shipped is completed
        expect(greenConnectors).toHaveLength(1);

        // Shipped -> Out for Delivery
        // Out for Delivery -> Delivered
        // Delivered -> Returned
        expect(grayConnectors).toHaveLength(3);
    });

    it("renders Pending when returnDate is omitted", () => {
        render(
            <OrderTimeline
                timeline={{
                    orderCreated:
                        "2026-07-31T10:00:00.000Z",
                    shippedDate:
                        "2026-08-01T10:00:00.000Z",
                    outForDeliveryDate: null,
                    deliveredDate: null,
                }}
                itemStatus="shipped"
            />
        );

        expect(
            screen.getByText("In Progress")
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("Pending")
        ).toHaveLength(2);
    });

    it("renders five timeline circles", () => {
        const { container } = render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="shipped"
            />
        );

        const circles =
            container.querySelectorAll(".rounded-full");

        expect(circles).toHaveLength(5);
    });

    it("renders return date when provided", () => {
        render(
            <OrderTimeline
                timeline={{
                    ...timeline,
                    returnDate:
                        "2026-08-10T10:00:00.000Z",
                }}
                itemStatus="returned"
            />
        );

        expect(
            screen.getByText("August 10, 2026")
        ).toBeInTheDocument();
    });

    it("shows the cancelled banner and skips the step timeline entirely", () => {
        render(
            <OrderTimeline
                timeline={timeline}
                itemStatus="cancelled"
            />
        );

        expect(
            screen.getByText(/order cancelled/i)
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Placed")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText("Out for Delivery")
        ).not.toBeInTheDocument();
    });

    it("shows Out for Delivery when the backend status is out_for_delivery", () => {
        render(
            <OrderTimeline
                timeline={{
                    ...timeline,
                    outForDeliveryDate:
                        "2026-08-02T10:00:00.000Z",
                }}
                itemStatus="out_for_delivery"
            />
        );

        expect(
            screen.getByText("Out for Delivery")
        ).toBeInTheDocument();

        expect(
            screen.getByText("August 2, 2026")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Delivered")
        ).toBeInTheDocument();
    });
});