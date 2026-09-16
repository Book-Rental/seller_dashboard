import { SellerBook } from "../types/book";

export type SellerNavigationCallback = (
    page:
        | "dashboard"
        | "seller-orders"
        | "seller-order-details"
        | "seller-my-books"
        | "seller-add-book"
        | "seller-edit-book"
        | "seller-auctioned-books"
        | "seller-book-details",
    data?: string | SellerBook
) => void;

let navigationCallback: SellerNavigationCallback | null = null;

export const registerSellerNavigation = (
    callback: SellerNavigationCallback
) => {
    navigationCallback = callback;
};

export const redirectToDashboard = () => {
    navigationCallback?.("dashboard");
};

export const redirectToOrders = () => {
    navigationCallback?.("seller-orders");
};

export const redirectToMyBooks = () => {
    navigationCallback?.("seller-my-books");
};

export const redirectToAddBook = () => {
    navigationCallback?.("seller-add-book");
};

export const redirectToAuctionedBooks = () => {
    navigationCallback?.("seller-auctioned-books");
};

export const redirectToOrderDetails = (
    orderItemId: string
) => {
    navigationCallback?.(
        "seller-order-details",
        orderItemId
    );
};

export const redirectToEditBook = (
    bookId: string
) => {
    navigationCallback?.(
        "seller-edit-book",
        bookId
    );
};

export const redirectToBookDetails = (
    book: SellerBook
) => {
    navigationCallback?.(
        "seller-book-details",
        book
    );
};