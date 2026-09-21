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
    buyNowPrice?: number;

    duration: number;
    startDate: string;

    status:
        | "upcoming"
        | "live"
        | "completed"
        | "cancelled";

    currentBidPrice: number;

    highestBid?: {
        _id: string;
        auctionId: string;
        userId?: string;
        bidPrice: number;
        createdAt: string;

        bidder?: {
            _id: string;
            email: string | null;
        } | null;
    } | null;

    highestBidder?: {
        userId: string;
        name: string;
        email: string;
        phone: string | null;
        profileImage: string | null;

        address?: {
            _id?: string;
            name?: string;
            type?: "home" | "work" | "other";
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
            phone?: string;

            location?: {
                latitude?: number;
                longitude?: number;
            };

            isDefault?: boolean;
        } | null;
    } | null;

    bidCount: number;

    order?: {
        _id: string;
        orderNumber?: string;
        orderType: string;
        orderStatus: string;
        // [key: string]: any;
    } | null;
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