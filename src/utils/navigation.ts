export const redirectToOrders = () => {
    window.history.pushState({}, "", "/orders");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

export const redirectToOrderDetails = (
    orderItemId: string
) => {
    window.history.pushState(
        {},
        "",
        `/order-details?orderItemId=${orderItemId}`
    );

    window.dispatchEvent(
        new PopStateEvent("popstate")
    );
};

export const redirectToMyBooks = () => {
    window.history.pushState({}, "", "/my-books");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

export const redirectToAddBook = () => {
    window.history.pushState({}, "", "/add-book");
    window.dispatchEvent(new PopStateEvent("popstate"));
};

export const redirectToEditBook = (
    bookId: string
) => {
    window.history.pushState(
        {},
        "",
        `/edit-book?bookId=${bookId}`
    );

    window.dispatchEvent(
        new PopStateEvent("popstate")
    );
};