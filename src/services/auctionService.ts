const API_URL = import.meta.env.VITE_API_URL;

export type CreateAuctionPayload = {
    bookId: string;
    bidPrice: number;
    buyNowPrice?: number;
    duration: number;
    startDate: string;
};

export type AuctionDetails = {
    _id: string;
    bookId: string;
    bidPrice: number;
    buyNowPrice: number;
    duration: number;
    startDate: string;
    status?: string;
};

export type AuctionBook = {
    _id: string;
    name: string;
    description?: string;
    coverImage?: string;
    author?: string;
    language?: string;
    edition?: string;

    isAuction?: boolean;
    auctionId?: string | null;

    auction?: AuctionDetails;
};

export const createAuction = async (
    payload: CreateAuctionPayload
) => {
    const response = await fetch(
        `${API_URL}/api/auction/create-auction`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        }
    );

    const data = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
                data?.error ||
                "Failed to create auction"
        );
    }

    return data;
};

export const getAuctionBooks = async (): Promise<
    AuctionBook[]
> => {
    const response = await fetch(
        `${API_URL}/api/book?isAuction=true`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
                data?.error ||
                "Failed to fetch auction books"
        );
    }

    console.log(
        "Auction books API response:",
        data
    );

    if (
        Array.isArray(data?.data?.products)
    ) {
        return data.data.products;
    }
    if (Array.isArray(data)) {
        return data;
    }
    if (Array.isArray(data?.data)) {
        return data.data;
    }
    if (Array.isArray(data?.books)) {
        return data.books;
    }

    return [];
};