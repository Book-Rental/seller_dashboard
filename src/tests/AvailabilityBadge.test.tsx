import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AvailabilityBadge from "../components/AvailabilityBadge";


describe("AvailabilityBadge", () => {
    it("renders available status with green styles", () => {
        render(<AvailabilityBadge status="available" />);

        const badge = screen.getByText("available");

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-green-100");
        expect(badge).toHaveClass("text-green-700");
    });

    it("renders unavailable status with red styles", () => {
        render(<AvailabilityBadge status="unavailable" />);

        const badge = screen.getByText("unavailable");

        expect(badge).toHaveClass("bg-red-100");
        expect(badge).toHaveClass("text-red-700");
    });

    it("renders out of stock status even with spaces", () => {
        render(<AvailabilityBadge status="Out Of Stock" />);

        const badge = screen.getByText("Out Of Stock");

        expect(badge).toHaveClass("bg-red-100");
        expect(badge).toHaveClass("text-red-700");
    });

    it("renders inactive status with gray styles", () => {
        render(<AvailabilityBadge status="inactive" />);

        const badge = screen.getByText("inactive");

        expect(badge).toHaveClass("bg-gray-100");
        expect(badge).toHaveClass("text-gray-700");
    });

    it("renders unknown status with default gray styles", () => {
        render(<AvailabilityBadge status="pending" />);

        const badge = screen.getByText("pending");

        expect(badge).toHaveClass("bg-gray-100");
        expect(badge).toHaveClass("text-gray-700");
    });
});