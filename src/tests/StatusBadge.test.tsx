import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusBadge from "../components/StatusBadge";


describe("StatusBadge", () => {
    it("renders pending status with yellow styles", () => {
        render(<StatusBadge status="pending" />);

        const badge = screen.getByText("pending");

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-yellow-100");
        expect(badge).toHaveClass("text-yellow-700");
    });

    it("renders delivered status with green styles", () => {
        render(<StatusBadge status="delivered" />);

        const badge = screen.getByText("delivered");

        expect(badge).toHaveClass("bg-green-100");
        expect(badge).toHaveClass("text-green-700");
    });

    it("renders cancelled status with red styles", () => {
        render(<StatusBadge status="cancelled" />);

        const badge = screen.getByText("cancelled");

        expect(badge).toHaveClass("bg-red-100");
        expect(badge).toHaveClass("text-red-700");
    });

    it("handles uppercase status by normalizing it", () => {
        render(<StatusBadge status="SHIPPED" />);

        const badge = screen.getByText("SHIPPED");

        expect(badge).toHaveClass("bg-blue-100");
        expect(badge).toHaveClass("text-blue-700");
    });

    it("renders unknown status with default gray styles", () => {
        render(<StatusBadge status="processing" />);

        const badge = screen.getByText("processing");

        expect(badge).toHaveClass("bg-gray-100");
        expect(badge).toHaveClass("text-gray-700");
    });

    it("renders '-' when status is empty", () => {
        render(<StatusBadge />);

        const badge = screen.getByText("-");

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass("bg-gray-100");
        expect(badge).toHaveClass("text-gray-700");
    });
});