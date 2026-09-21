import { useMemo, useState } from "react";
import {
    Pagination,
    Rb_Button,
    Rb_LoadingSpinner,
    Rb_Text,
} from "@rentbook/rentbook-ui-lib";

import BookTable from "../components/BookTable";
import { useSellerBooks } from "../hooks/useSellerBooks";
import { SellerBook } from "../types/book";

import SellerLayout from "../components/SellerLayout";
import { redirectToAddBook } from "../utils/sellerNavigation";

const MyBooks = () => {
    const user = window.HOST_USER_INFO;
    const sellerId = user._id;

    const [page, setPage] = useState(1);
    const [availability, setAvailability] = useState("");
    const [categoryName, setCategoryName] = useState("");

    const { data, isLoading } = useSellerBooks(
        sellerId,
        page,
        categoryName
    );

    const books: SellerBook[] =
        data?.data?.books?.books ?? [];

    /*
     * API:
     * book.categoryId.name
     */
    const categories = useMemo(() => {
        return [
            ...new Set(
                books
                    .map((book) => book.categoryId?.name)
                    .filter(Boolean)
            ),
        ];
    }, [books]);

    const meta = data?.data?.books?.meta;

    const totalPages = meta?.totalPages ?? 0;

    /*
     * Availability filter
     */
    const displayedBooks = useMemo(() => {
        return books.filter((book) => {
            return (
                availability === "" ||
                book.availabilityStatus === availability
            );
        });
    }, [books, availability]);

    return (
        <SellerLayout currentPage="seller-my-books">
            <div className="min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Rb_Text
                            variant="h1"
                            className="text-2xl font-bold sm:text-3xl"
                        >
                            My Books
                        </Rb_Text>

                        <Rb_Text
                            variant="p"
                            className="mt-1 text-sm text-gray-500 sm:text-base"
                        >
                            Total Books:{" "}
                            {meta?.totalRecords ?? 0}
                        </Rb_Text>
                    </div>

                    <Rb_Button
                        onClick={redirectToAddBook}
                        className="w-full sm:w-auto"
                    >
                        + Add Book
                    </Rb_Button>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    {/* Category */}
                    <select
                        value={categoryName}
                        onChange={(e) => {
                            setPage(1);
                            setCategoryName(
                                e.target.value
                            );
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:w-56"
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Availability */}
                    <select
                        value={availability}
                        onChange={(e) =>
                            setAvailability(
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:w-48"
                    >
                        <option value="">
                            Availability
                        </option>

                        <option value="available">
                            Available
                        </option>

                        <option value="unavailable">
                            Unavailable
                        </option>
                    </select>
                </div>

                {/* Books */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Rb_LoadingSpinner
                            text="Loading books..."
                        />
                    </div>
                ) : (
                    <>
                        <BookTable
                            books={displayedBooks}
                        />

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center sm:mt-8">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    siblingCount={1}
                                    disabled={isLoading}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </SellerLayout>
    );
};

export default MyBooks;