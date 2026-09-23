export type SellerAuction = {
    _id: string;
    bookId: string;

    bidPrice: number;
    buyNowPrice?: number;

    duration: number;
    startDate: string;

    isActive: boolean;

    status:
        | "upcoming"
        | "live"
        | "completed"
        | "cancelled";

    currentBidPrice?: number;

    highestBid?: {
        _id: string;
        auctionId: string;
        userId: string | null;
        bidPrice: number;
        createdAt: string;
        bidder?: {
            _id: string;
            email: string;
        } | null;
    } | null;

    highestBidder?: {
        userId: string;
        name: string;
        email: string;
        phone?: string;
        profileImage?: string | null;
        address?: unknown;
    } | null;

    bidCount?: number;

    order?: {
        _id: string;
        orderNumber: string;
        orderType: string;
        orderStatus: string;
        isActive: boolean;
        [key: string]: unknown;
    } | null;
};

export interface SellerBook {
    _id: string;
    sellerId: string;

    name: string;
    description: string;

    coverImage: string;

    images?: string[];

    categoryId?: {
        _id: string;
        name: string;
    };

    language: string;
    author: string;
    edition?: string;

    rentalPricePerDay: number;
    rentalPricePerWeek: number;
    rentalPricePerMonth: number;

    purchasePrice?: number;
    securityDeposit: number;

    availableForSale: boolean;
    availableForRent: boolean;

    availabilityStatus:
        | "available"
        | "rented_out"
        | "sold"
        | "maintenance";

    listingType: "sale" | "rent" | "both";

    quantity: number;

    condition:
        | "new"
        | "used"
        | "like new"
        | "refurbished";

    numberOfPages?: number;
    publicationDate?: string;

    isPopular?: boolean;
    isAuction: boolean;

    isActive: boolean;
    isAvailable: boolean;

    status: string;

    createdAt: string;
    updatedAt: string;

    auctionId?: string;

    auction: SellerAuction[];
}