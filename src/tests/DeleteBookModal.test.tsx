import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DeleteBookModal from "../components/DeleteBookModal";

vi.mock("@rentbook/rentbook-ui-lib", () => ({
    Rb_Button: ({
        children,
        onClick,
        disabled,
        className,
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    ),
    Rb_Text: ({
        children,
        className,
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => <div className={className}>{children}</div>,
}));

describe("DeleteBookModal", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("does not render when open is false", () => {
        render(
            <DeleteBookModal
                open={false}
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.queryByText("Delete Book")
        ).not.toBeInTheDocument();
    });

    it("renders modal when open is true", () => {
        render(
            <DeleteBookModal
                open
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.getByText("Delete Book")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/This action cannot be undone/i)
        ).toBeInTheDocument();
    });

    it("displays the book name", () => {
        render(
            <DeleteBookModal
                open
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.getByText(/Atomic Habits/)
        ).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", async () => {
        const user = userEvent.setup();

        render(
            <DeleteBookModal
                open
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.click(screen.getByRole("button", { name: "Cancel" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when Delete is clicked", async () => {
        const user = userEvent.setup();

        render(
            <DeleteBookModal
                open
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        await user.click(screen.getByRole("button", { name: "Delete" }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("shows loading state", () => {
        render(
            <DeleteBookModal
                open
                loading
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.getByRole("button", {
                name: "Deleting...",
            })
        ).toBeInTheDocument();
    });

    it("disables both buttons while loading", () => {
        render(
            <DeleteBookModal
                open
                loading
                bookName="Atomic Habits"
                onClose={onClose}
                onConfirm={onConfirm}
            />
        );

        expect(
            screen.getByRole("button", { name: "Cancel" })
        ).toBeDisabled();

        expect(
            screen.getByRole("button", { name: "Deleting..." })
        ).toBeDisabled();
    });
});