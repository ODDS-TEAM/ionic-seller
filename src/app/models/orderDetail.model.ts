export class OrderDetail {
    // tslint:disable-next-line: variable-name
    _id: string;
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
    items: ItemInfo[];
}

export class ItemInfo {
    // tslint:disable-next-line: variable-name
    _id: string;
    options: string[];
    dayMenuId: string;
    foodName: string;
    numberOfItem: number;
    price: number;
    pictureUrl: string;
    specialInstruction: string;
}
