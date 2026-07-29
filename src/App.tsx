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

const queryClient = new QueryClient();

export type Flag =
    | "dashboard"
    | "orders"
    | "order-details"
    | "my-books"
    | "add-book"
    | "edit-book";

type AppProps = {
  flag?: Flag;
};

function App({ flag }: AppProps) {
    const pathname = window.location.pathname;

    const searchParams = new URLSearchParams(
        window.location.search
    );

    const bookId = searchParams.get("bookId") ?? "";

    const currentPage: Flag =
        flag ??
        (pathname === "/dashboard"
            ? "dashboard"
            : pathname === "/orders"
              ? "orders"
              : pathname === "/order-details"
                ? "order-details"
                : pathname === "/my-books"
                  ? "my-books"
                  : pathname === "/add-book"
                    ? "add-book"
                    : pathname === "/edit-book"
                      ? "edit-book"
                      : "dashboard");

    const renderPage = () => {
        switch (currentPage) {
            case "dashboard":
                return <Dashboard />;

            case "orders":
                return <Orders />;

            case "order-details":
                return <OrderDetails />;

            case "my-books":
                return <MyBooks />;

            case "add-book":
                return <AddBook mode="create" />;

            case "edit-book":
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