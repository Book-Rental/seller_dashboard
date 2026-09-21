  import {
      redirectToOrders,
      redirectToMyBooks,
      redirectToAddBook,
      redirectToDashboard,
  } from "../utils/sellerNavigation";

  type SellerSidebarProps = {
      currentPage:
          | "dashboard"
          | "seller-orders"
          | "seller-order-details"
          | "seller-my-books"
          | "seller-add-book"
          | "seller-edit-book"
          | "seller-auctioned-books";
  };

  export default function SellerSidebar({
      currentPage,
  }: SellerSidebarProps) {
      return (
          <aside className="hidden w-64 shrink-0 border-r bg-white p-4 lg:block">
              <h2 className="mb-6 text-xl font-bold">
                  Seller Dashboard
              </h2>

              <nav className="space-y-2">
                  <button
                      onClick={redirectToDashboard}
                      className={`w-full rounded-md p-3 text-left ${currentPage === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                          }`}
                  >
                      Dashboard
                  </button>

                  <button
                      onClick={redirectToOrders}
                      className={`w-full rounded-md p-3 text-left ${currentPage === "seller-orders"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                  >
                      Orders
                  </button>

                  <button
                      onClick={redirectToMyBooks}
                      className={`w-full rounded-md p-3 text-left ${currentPage === "seller-my-books"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                  >
                      My Books
                  </button>

                  <button
                      onClick={redirectToAddBook}
                      className={`w-full rounded-md p-3 text-left ${currentPage === "seller-add-book"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                  >
                      Add Book
                  </button>
                  {/* <button
                      onClick={
                          redirectToAuctionedBooks
                      }
                      className={`w-full rounded-md p-3 text-left ${
                          currentPage ===
                          "seller-auctioned-books"
                              ? "bg-blue-600 text-white"
                              : "hover:bg-gray-100"
                      }`}
                  >
                      Auctioned Books
                  </button> */}

              </nav>
          </aside>
      );
  }