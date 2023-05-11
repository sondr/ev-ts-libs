import { CartItem } from "./cart-item";
import { CartBase } from "./cart-base";
import { ICartItemData, ICartSettings } from "./interfaces";

//export function Convert(p: ProductData): ICartItemData {
//    const i: ICartItemData = {
//        qty: 0,
//        regularPrice: 0,
//        price: 0,
//        useCustomPrice: false
//    };


//    return i;
//}
interface IProduct {
    id: number;
    name: string;
    price: number;
}


// const find = (productId: any): IProduct => {
//     return this.products.find(e => e.id == productId)!;
// }
const Convert = (p: IProduct): ICartItemData => ({
    qty: 0,
    regularPrice: 0,
    price: 0,
    useCustomPrice: false
});



export class Cart extends CartBase<IProduct> {
    public find(products: IProduct[], productId: any): IProduct {
        return products.find(e => e.id == productId)!;
    }
    

    public converter = Convert;
    public itemChange(event) {
        console.log(event);
    }
    public calculated(event) {
        console.log(event);
    }

    constructor(settings: ICartSettings) {
        super(settings);
    }
}

let c = new Cart({
    key: 'demo-1',
    type: 'wishlist',
    autoCalculate: true,
    consumerType: 'b2c',
    taxPercent: 25,
    autoCalculateTimeoutMS: 500
});

