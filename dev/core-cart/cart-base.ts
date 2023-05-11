import { CartItem, ICartItemExportOptions, cartItemDefaults } from "./cart-item";
import { ConsumerTypeId, Customer, ICartData, ICartEvent, ICartItemData, ICartSettings, IItemsOwner } from "./interfaces";

const defaultSettings: ICartSettings = {
    consumerType: "b2c",
    autoCalculate: true,
    taxPercent: 0
};


export abstract class CartBase<TProduct> implements ICartData, IItemsOwner<TProduct> {
    protected settings: ICartSettings = defaultSettings;
    protected products: TProduct[] = [];


    public id?: any;
    public createdDate: Date;
    public customer: Customer;

    public consumerType: ConsumerTypeId;
    public currency?: string;
    public desiredDate?: Date;
    public items: CartItem<TProduct>[] = [];

    totalTax: number;
    totalDiscount: number;
    totalNet: number;
    totalSum: number;

    public message: string;

    constructor(
        settings: ICartSettings,
        private global: Window = window
    ) {
        this.createdDate = new Date();
        Object.assign(this.settings, settings || {});
    }

    //public abstract find(productId: any): TProduct;
    public abstract find(products: TProduct[], productId: any): TProduct;
    public abstract converter(product: TProduct): ICartItemData;
    
    public itemChange?(event: ICartEvent): void;
    public calculated?(event: ICartEvent): void;



    public add(product: TProduct, quantity: number = 1) {
        const item = this.convert(product);
        const currentItem = this.items.find(e => e.productId == item.productId);
        if (currentItem) {
            currentItem.qty += quantity;

            this.autoCalculate();
        }
        else {
            this.addLine(item, quantity);
        }
    }

    public addLine(item: CartItem<TProduct>, quantity: number = 1) {
        this.items.push(item);

        this.autoCalculate();
    }

    public removeSelected() { }
    public removeLine(item: ICartItemData) {
        const index = this.items.findIndex(e => e == item);
        const i = this.items[index];
        const prevValue = i.export({ onlyToggled: false });

        this.items.slice(index, 1);

        this.autoCalculate();
    }

    public emptyItems() {
        this.items = [];
        this.autoCalculate();
    }


    public getSelectedItems() {
        return this.items.filter(e => e.toggled);
    }


    // export and load
    public export(opts: ICartDataExportParams): Required<ICartData> {
        return {
            id: this.id,
            createdDate: this.createdDate,
            consumerType: this.consumerType,
            customer: this.customer,
            currency: this.currency!,
            desiredDate: this.desiredDate!,
            message: this.message,
            items: this.items.map(i => i.export(opts))
        };
    }

    public async load(data: ICartData, cb: (productIds: number[]) => Promise<TProduct[]>) {
        this.calculateItemQuantities(data.items ?? []);
        const productIds = Array.from(this.itemQuantities.values());
        const products = await cb(productIds);
        this.products = products;

        const controller = this;
        const recurseiveItemFn = (itemDatas: ICartItemData[], owner: IItemsOwner<TProduct>): CartItem<TProduct>[] => {
            return itemDatas.map(itemdata => {
                const product = this.find(this.products, itemdata.productId);
                const cartItem = new CartItem<TProduct>(controller, owner, itemdata, product);
                cartItem.items = recurseiveItemFn(cartItem.items, cartItem);

                return cartItem;
            });
        };
        const cartItems = recurseiveItemFn(data.items, controller);

        this.items = cartItems;
        this.setValues(data);
        
        this.autoCalculate();
    }

    public setValues(data: ICartData) {
        this.id = data.id;
        this.createdDate = data.createdDate;
        this.consumerType = data.consumerType;
        this.currency = data.currency;
        this.customer = data.customer;
        this.desiredDate = data.desiredDate;
        this.message = data.message ?? '';
    }


    // calculate
    public calculate() {
        let totalTax: number = 0,
            totalDiscount: number = 0,
            totalNet: number = 0,
            totalSum: number = 0;

        this.calculateItemQuantities(this.items);

        for (const item of this.items) {
            item.calculate();

            totalDiscount += item.totalDiscount;
            totalNet += item.totalNet;
            totalTax += item.totalTax;
            totalSum += item.totalSum;
        }

        this.totalDiscount = totalDiscount;
        this.totalNet = totalNet;
        this.totalTax = totalTax;
        this.totalSum = totalSum;

        if (this.calculated) {
            this.calculated({ type: 'calculated', shouldCalculate: false, });
        }
    }

    private calculateTimer: number;
    private autoCalculate() {
        this.global.clearTimeout(this.calculateTimer);
        this.calculateTimer = this.global.setTimeout(() => {
            if (this.settings.autoCalculate) {
                this.calculate();
            }
        }, this.settings.autoCalculateTimeoutMS ?? 250);
    }




    // events
    dispatchChange(event: ICartEvent) {
        if (this.itemChange) {
            this.itemChange(event);
        }

        if (event?.shouldCalculate) {
            this.autoCalculate();
        }
    }




    // private
    private convert(product: TProduct): CartItem<TProduct> {
        const converted = this.converter(product);
        return new CartItem<TProduct>(this, this, converted, product);
    }


    public getTotalProductCount(productId: any) {
        return this.itemQuantities.get(String(productId)) ?? 0;
    }
    private itemQuantities: Map<string, number> = new Map<string, number>();
    private calculateItemQuantities(items: ICartItemData[]) {
        // recursive inner method
        const addToIQ = (item: ICartItemData) => {
            const pcode = item.productId;
            let value = item.qty ?? 0;
            if (this.itemQuantities.has(pcode)) {
                value += this.itemQuantities.get(pcode) ?? 0;
            }

            this.itemQuantities.set(pcode, value);

            if (!item.items?.length) { return; }
            for (const c of item.items) {
                addToIQ(c);
            }
        }

        this.itemQuantities.clear();
        for (const item of items) {
            addToIQ(item);
        }
    }
}

interface ICartDataExportParams extends ICartItemExportOptions {

}