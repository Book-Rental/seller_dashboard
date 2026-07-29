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
    purchasePrice: number;
    rentalPricePerDay: number;
    rentalPricePerWeek: number;
    rentalPricePerMonth: number;
    securityDeposit: number;
    quantity: number;
    availabilityStatus: string;
    isAvailable: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}