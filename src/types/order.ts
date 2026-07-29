export interface RecentOrder {
    orderNumber: string;
    orderId: string;
    orderItemId: string;
    bookId: string;
    bookName: string;
    rentalPrice: number;
    status: string;
    date: string;
}

export interface SellerOrder extends RecentOrder {
    buyerName: string;
}

export interface OrderDetails {
    orderId: string;
    orderNumber: string;
    orderStatus: string;

    book: {
        _id: string;
        name: string;
        author: string;
        description: string;
        coverImage: string;
        language: string;
        edition: string;
        isbn: string;
        rentalPricePerDay: number;
        rentalPricePerWeek: number;
        rentalPricePerMonth: number;
        purchasePrice: number;
        securityDeposit: number;
        quantity: number;
        isActive: boolean;
        isAvailable: boolean;
    };

    rental: {
        rentalDuration: number;
        rentStartDate: string;
        expectedReturnDate: string;
        actualReturnDate: string | null;
        extensionCount: number;
        lateFee: number;
    };

    itemStatus: string;
    quantity: number;

    buyer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;

        shippingAddress: {
            name: string;
            phone: string;
            type: string;
            addressLine1: string;
            addressLine2: string;
            landmark: string;
            city: string;
            state: string;
            pincode: string;
            country: string;
        };
    };

    timeline: {
        orderCreated: string;
        rentStartDate: string;
        expectedReturnDate: string;
        actualReturnDate: string | null;
        shippedDate: string | null;
        deliveredDate: string | null;
        returnDate: string | null;
    };

    paymentSummary: {
        rentalAmount: number;
        securityDeposit: number;
        quantity: number;
        subtotal: number;
        depositTotal: number;
        deliveryFee: number;
        discount: number;
        tax: number;
        totalAmount: number;
        refundAmount: number;
        depositStatus: string;
        depositRefundedAmount: number;
        depositDeductionAmount: number;
    };
}