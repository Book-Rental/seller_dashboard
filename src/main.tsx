import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


ReactDOM.createRoot(
    document.getElementById("root")!
).render(
    <React.StrictMode>

        {/* Dashboard */}
        {/* <App flag="dashboard" /> */}

        {/* Orders */}
        {/* <App flag="orders" /> */}

        {/* Order Details */}
        {/* <App flag="order-details" /> */}

        {/* My Books */}
        <App />

        {/* Add Book */}
        {/* <App flag="add-book" /> */}

        {/* Edit Book */}
        {/* <App flag="edit-book" /> */}

    </React.StrictMode>
);