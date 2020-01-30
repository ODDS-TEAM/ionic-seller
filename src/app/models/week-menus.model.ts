export class WeekMenus {
    week: number;
    days: Days[];
}

export class Days {
    day: string;
    date: Date;
    stores: Stores[];
}

export class Stores {
    sellerID: string;
    name: string;
    menus: Menus[];
}

export class Menus {
    menuID: string;
    name: string;
    imgUrl: string;
    limit: number;
}
