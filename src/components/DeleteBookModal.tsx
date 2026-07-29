import { Rb_Button, Rb_Text } from "@rentbook/rentbook-ui-lib";

type DeleteBookModalProps = {
    open: boolean;
    bookName: string;
    loading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteBookModal = ({
    open,
    bookName,
    loading = false,
    onClose,
    onConfirm,
}: DeleteBookModalProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <Rb_Text
                    variant="h3"
                    className="mb-3 text-xl font-semibold"
                >
                    Delete Book
                </Rb_Text>

                <Rb_Text
                    variant="p"
                    className="text-gray-600"
                >
                    Are you sure you want to delete
                    <span className="font-semibold">
                        {" "}
                        "{bookName}"
                    </span>
                    ?
                </Rb_Text>

                <Rb_Text
                    variant="p"
                    className="mt-2 text-sm text-red-500"
                >
                    This action cannot be undone.
                </Rb_Text>

                <div className="mt-6 flex justify-end gap-3">
                    <Rb_Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Rb_Button>

                    <Rb_Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Rb_Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBookModal;