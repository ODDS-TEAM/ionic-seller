export class History {
    orderId: string;
    orderType: 'food';
    dateTime: Date;
    state: string;
    customerName: string;
    items: Food[];
}

class Food {
    foodName: string;
}

export class HistoryDetail {
    _id?: string;
    orderType: 'food';
    dateTime: Date;
    state: string;
    queue: number;
    customerId: string;
    customerName: string;
    customerImageUrl: string;
    merchantId: string;
    merchantName: string;
    paymentMethod: 'cash';
    items: Item[];
}

class Item {
    options: string[];
    dayMenuId: string;
    foodName: string;
    numberOfItem: number;
    price: number;
    imageUrl: string;
    specialInstruction: string;
}
