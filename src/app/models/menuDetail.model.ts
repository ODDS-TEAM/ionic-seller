export class FoodMenuDetail {
    // tslint:disable-next-line: variable-name
    _id?: string;
    foodName: string;
    price: number;
    description: string;
    imageUrl?: string;
    options: FoodMenuOption[];
    merchantId?: string;
}

export class FoodMenuOption {
    titleOption: string;
    singleChoice: boolean | string;
    choices: Choice[];
}

export class Choice {
    titleChoice: string;
    priceChoice: number;
}
