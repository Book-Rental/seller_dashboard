import { ReactNode } from "react";
import SellerSidebar from "./SellerSidebar";

type SellerLayoutProps = {
    currentPage:
        | "dashboard"
        | "seller-orders"
        | "seller-order-details"
        | "seller-my-books"
        | "seller-add-book"
        | "seller-edit-book"
        | "seller-auctioned-books";

    children: ReactNode;
};

export default function SellerLayout({
    currentPage,
    children,
}: SellerLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SellerSidebar currentPage={currentPage} />

            <main className="flex-1 overflow-auto p-6">
                {children}
            </main>
        </div>
    );
}