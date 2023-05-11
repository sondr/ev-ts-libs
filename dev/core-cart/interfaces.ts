export type ConsumerTypeId = 'b2c' | 'b2b';

export interface ICartSettings {
    key?: string;
    type?: string;
    consumerType: ConsumerTypeId;

    taxPercent: number;
    autoCalculate: boolean;
    autoCalculateTimeoutMS?: number;
}


export interface Customer {
    id?: any;
    contactId?: any;

    name?: string; // org name
    phone: string;
    email: string;

    address: Address;
    deliveryAddress?: Address;
}

export interface Address {
    firstName?: string;
    lastName?: string;

    street: string;
    streetCo: string;
    zip: string;
    city: string;

    phone?: string;
    email?: string;
}

export interface ICartEvent {
    type: 'calculated' | 'chane' | 'item-remove' | 'item-add' | 'item-change';
    property?: string;
    items?: ICartEventValue[];
    shouldCalculate: boolean;
}
interface ICartEventValue {
    current?: ICartItemData;
    prev?: ICartItemData;
}

//export interface ICartItemConvertData<TProduct> extends ICartItemData {

//}

export interface IItemsOwner<TProduct> {
    totalTax: number;
    totalDiscount: number;
    totalNet: number;
    totalSum: number;

    items: IItemsOwner<TProduct>[];

    add(product: TProduct, quantity: number);
    addLine(item: ICartItemData, quantity: number);

    //remove();
    removeSelected();
    removeLine(item: ICartItemData);

    calculate();
}

export interface ICartItemData {
    id?: any;
    productId?: any;
    qty: number;
    regularPrice: number;
    price: number;
    taxPercent?: number;
    unit?: string;
    currency?: string;

    marking?: string;

    prices?: ICartItemPrice[];
    discounts?: ICartItemDiscount[];

    useCustomPrice: boolean;

    items?: ICartItemData[];
}

export interface ICartData {
    id?: any;
    createdDate: Date;
    consumerType: ConsumerTypeId;
    currency?: string;
    customer: Customer;
    desiredDate?: Date;
    message?: string;

    items: ICartItemData[];
}

export interface ICartItemPrice {
    qty: number;
    price: number;
}

export enum CartDiscountEnum {
    Amount = 'amount',
    Percent = '%'
}
export interface ICartItemDiscount {
    type: CartDiscountEnum;//'amount' | '%';
    value: number;
}



//export interface ICartData<TCartItems> {
//    id?: any;
//    createdDate: Date;
//    consumerType: ConsumerTypeId;
//    currency?: string;
//    customer: Customer;
//    desiredDate?: Date;
//    message?: string;
//    items: TCartItems[];
//}




interface ItemInterface {
    name: string;
    items: ItemInterface[];
}

class Item<TProduct> implements ItemInterface {
    name: string;
    items: Item<TProduct>[];
}