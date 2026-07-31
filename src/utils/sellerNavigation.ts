import { Flag } from "../App";

let navigate: ((page: Flag, data?: string) => void) | null = null;

export const registerSellerNavigation = (
    handler: (page: Flag, data?: string) => void
) => {
    navigate = handler;
};

export const redirectToDashboard = () => {
    navigate?.("dashboard");
};

export const redirectToOrders = () => {
    navigate?.("seller-orders");
};

export const redirectToMyBooks = () => {
    navigate?.("seller-my-books");
};

export const redirectToAddBook = () => {
    navigate?.("seller-add-book");
};

export const redirectToOrderDetails = (
    orderItemId: string
) => {
    navigate?.("seller-order-details", orderItemId);
};

export const redirectToEditBook = (
    bookId: string
) => {
    navigate?.("seller-edit-book", bookId);
};