const API_URL = import.meta.env.VITE_API_URL;

export const getSellerBooks = async (
    sellerId: string,
    page = 1,
    limit = 10,
    categoryName = ""
) => {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    console.log("Category:", categoryName);
    console.log(
        `${API_URL}/api/book/seller/${sellerId}?${params.toString()}`
    );
    if (categoryName) {
        params.append("categoryName", categoryName);
    }
    console.log(
        `${API_URL}/api/book/seller/${sellerId}?${params.toString()}`
    );
    const response = await fetch(
        `${API_URL}/api/book/seller/${sellerId}?${params.toString()}`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch seller books");
    }

    return response.json();
};

export const createBook = async (formData: FormData) => {
    const response = await fetch(
        `${API_URL}/api/book/create`,
        {
            method: "POST",
            credentials: "include",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create book"
        );
    }

    return data;
};

export const getBookById = async (bookId: string) => {
    const response = await fetch(
        `${API_URL}/api/book/${bookId}`,
        {
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch book"
        );
    }

    return data;
};

export const updateBook = async ({
    bookId,
    formData,
}: {
    bookId: string;
    formData: FormData;
}) => {
    const response = await fetch(
        `${API_URL}/api/book/update/${bookId}`,
        {
            method: "PUT",
            credentials: "include",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update book"
        );
    }

    return data;
};

export const deleteBook = async (bookId: string) => {
    const response = await fetch(
        `${API_URL}/api/book/${bookId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete book"
        );
    }

    return data;
};