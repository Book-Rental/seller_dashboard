export interface SellerBook {
    _id: string;
    sellerId: string;

    name: string;
    description: string;

    coverImage: string;

    images: {
        url: string;
        altText: string;
    }[];

    author: string;
    language: string;
    edition: string;
    isbn: string;

    categoryId: {
        _id: string;
        name: string;
    };

    category?: {
        _id: string;
        name: string;
        description?: string;
        isActive?: boolean;
        isPopular?: boolean;
    };

    purchasePrice: number;

    rentalPricePerDay: number;
    rentalPricePerWeek: number;
    rentalPricePerMonth: number;

    securityDeposit: number;

    quantity: number;

    availabilityStatus: string;
    isAvailable: boolean;
    isActive: boolean;

    availableForRent?: boolean;
    availableForSale?: boolean;

    status?: string;

    isAuction?: boolean;

    /**
     * Auction ID stored on the book.
     * API returns this as a string.
     */
    auctionId?: string;

    /**
     * Full auction details returned by the API.
     */
    auction?: {
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

    createdAt: string;
    updatedAt: string;
}