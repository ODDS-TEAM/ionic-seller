export class Order {
    orderId: string;
    orderType: string;
    dateTime: Date;
    state: string;
    queue: number;
    customerId: string;
    customerName: string;
    customerImageUrl: string;
    merchantId: string;
    merchantName: string;
    paymentMethod: string;
    items: Item[];
}

export class Item {
    foodName: string;
    numberOfItem: number;
}
