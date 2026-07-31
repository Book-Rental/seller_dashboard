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
import { useEffect, useState } from "react";
import { registerSellerNavigation } from "./utils/sellerNavigation";

const queryClient = new QueryClient();

export type Flag =
    | "dashboard"
    | "seller-orders"
    | "seller-order-details"
    | "seller-my-books"
    | "seller-add-book"
    | "seller-edit-book";



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

    const [orderItemId, setOrderItemId] = useState("");
    
    useEffect(() => {
        registerSellerNavigation((page, data) => {
            setCurrentPage(page);

            if (page === "seller-edit-book") {
                setBookId(data ?? "");
            }

            if (page === "seller-order-details") {
                setOrderItemId(data ?? "");
            }
        });
    }, []);
    const renderPage = () => {
        switch (currentPage) {
            case "seller-orders":
                return <Orders />;

            case "seller-order-details":
                return <OrderDetails orderItemId={orderItemId}/>;

            case "seller-my-books":
                return <MyBooks />;

            case "seller-add-book":
                return <AddBook mode="create" />;

            case "seller-edit-book":
                return (
                    <AddBook
                        mode="edit"
                        bookId={bookId}
                    />
                );

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