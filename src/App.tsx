import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import "@rentbook/rentbook-ui-lib/microfrontend.min.css";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import MyBooks from "./pages/MyBooks";
import AddBook from "./pages/AddBook";
import BookDetailsPage from "./pages/BookDetailsPage";

import { useEffect, useState } from "react";

import {
    registerSellerNavigation,
} from "./utils/sellerNavigation";

import { SellerBook } from "./types/book";

const queryClient = new QueryClient();

export type Flag =
    | "dashboard"
    | "seller-orders"
    | "seller-order-details"
    | "seller-my-books"
    | "seller-add-book"
    | "seller-edit-book"
    | "seller-auctioned-books"
    | "seller-book-details";

type HeaderSellerNavigation =
    | "dashboard"
    | "orders"
    | "my-books"
    | "add-book"
    | "auctioned-books";

function App() {
    useEffect(() => {
        window.dispatchEvent(
            new CustomEvent("widget-loading-status", {
                detail: false,
            })
        );
    }, []);

    const [currentPage, setCurrentPage] =
        useState<Flag>("dashboard");

    const [bookId, setBookId] =
        useState("");

    const [orderItemId, setOrderItemId] =
        useState("");
    const [selectedBook, setSelectedBook] =
        useState<SellerBook | null>(null);
    useEffect(() => {

        registerSellerNavigation(
            (page, data) => {

                setCurrentPage(page);
                if (
                    page ===
                    "seller-edit-book"
                ) {
                    if (
                        typeof data ===
                        "string"
                    ) {
                        setBookId(data);
                    }
                }
                if (
                    page ===
                    "seller-order-details"
                ) {
                    if (
                        typeof data ===
                        "string"
                    ) {
                        setOrderItemId(data);
                    }
                }
                if (
                    page ===
                    "seller-book-details"
                ) {
                    if (
                        typeof data !==
                            "string" &&
                        data
                    ) {
                        setSelectedBook(
                            data
                        );
                    }
                }
            }
        );

    }, []);
    useEffect(() => {

        const handleHeaderSellerNavigation = (
            event: Event
        ) => {

            const customEvent =
                event as CustomEvent<{
                    page:
                        HeaderSellerNavigation;
                }>;

            const page =
                customEvent.detail?.page;

            if (!page) {
                return;
            }

            switch (page) {
                case "dashboard":

                    setCurrentPage(
                        "dashboard"
                    );

                    break;
                case "orders":

                    setCurrentPage(
                        "seller-orders"
                    );

                    break;
                case "my-books":

                    setCurrentPage(
                        "seller-my-books"
                    );

                    break;
                case "add-book":

                    setCurrentPage(
                        "seller-add-book"
                    );

                    break;
                case "auctioned-books":

                    setCurrentPage(
                        "seller-auctioned-books"
                    );

                    break;

                default:
                    break;
            }
        };

        window.addEventListener(
            "seller-navigation",
            handleHeaderSellerNavigation
        );

        return () => {
            window.removeEventListener(
                "seller-navigation",
                handleHeaderSellerNavigation
            );
        };

    }, []);
    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return <Dashboard />;           case "seller-orders":
                return <Orders />;
            case "seller-order-details":
                return (
                    <OrderDetails
                        orderItemId={
                            orderItemId
                        }
                    />
                );

            case "seller-my-books":
                return <MyBooks />;

            case "seller-add-book":
                return (
                    <AddBook
                        mode="create"
                    />
                );

            case "seller-edit-book":
                return (
                    <AddBook
                        mode="edit"
                        bookId={bookId}
                    />
                );

            case "seller-book-details":

                return selectedBook ? (
                    <BookDetailsPage
                        book={
                            selectedBook
                        }
                    />
                ) : (
                    <MyBooks />
                );
            case "seller-auctioned-books":
                return <Dashboard />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <QueryClientProvider client={queryClient}>
            {renderPage()}
        </QueryClientProvider>
    );
}

export default App;