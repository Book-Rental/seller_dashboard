export interface Book {
  _id: string;
  name: string;
  author: string;
  coverImage: string;
}

export interface OrderItem {
  _id: string;
  bookId: Book;
  sellerId: string;
  orderType: string;
  quantity: number;
  rentalPrice: number;
  securityDeposit: number;
  itemStatus: string;
  rentStartDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  subtotal: number;
  securityDepositTotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}