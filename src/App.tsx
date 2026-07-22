import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";


const queryClient = new QueryClient();

type Flag =
  | "dashboard"
  | "orders"
  | "order-details";

type AppProps = {
  flag?: Flag;
};

function App({ flag }: AppProps) {
  const currentPage = flag ?? "dashboard";

  return (
    <QueryClientProvider client={queryClient}>
      {currentPage === "dashboard" && <Dashboard />}
      {currentPage === "orders" && <Orders />}
      {currentPage === "order-details" && <OrderDetails />}
    </QueryClientProvider>
  );
}

export default App;