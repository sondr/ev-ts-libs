import { computedFrom } from 'aurelia-framework';
import { CartBase } from "./cart-base";
import { CartDiscountEnum, ICartEvent, ICartItemData, ICartItemDiscount, ICartItemPrice, IItemsOwner } from "./interfaces";

export const cartItemDefaults: ICartItemData = {
    qty: 1,
    regularPrice: 0,
    price: 0,
    discounts: [],
    prices: [],
    items: [],
    useCustomPrice: false
};



export class CartItem<TProduct> implements ICartItemData, IItemsOwner<TProduct> {
    public id?: any;
    public productId?: any;

    public taxPercent: number;
    public regularPrice: number;
    public unit?: string;
    public currency?: string;

    //discountAmount?: number;
    //discountPercent?: number;

    public lineDiscount: number = 0;
    public lineTax: number = 0;
    public lineNet: number = 0;
    public lineSum: number = 0;

    public totalTax: number = 0;
    public totalDiscount: number = 0;
    public totalNet: number = 0;
    public totalSum: number = 0;

    public items: CartItem<TProduct>[] = [];
    public prices: ICartItemPrice[] = [];
    public discounts: ICartItemDiscount[] = [];

    public product: TProduct;


    // flags
    public toggled: boolean = false;

    public useTax: boolean = true;
    public useCustomPrice: boolean = false;


    constructor(
        private readonly _controller: CartBase<TProduct>,
        public readonly _owner: IItemsOwner<TProduct>,
        values: ICartItemData,
        product: TProduct
    ) {
        this.setValues(values, product);
    }

    private setValues(values: ICartItemData, product: TProduct) {
        const converted = this._controller.converter(product);
        const prices = converted?.prices?.sort((a, b) => b.qty - a.qty);

        this.product = product;

        this.id = converted.id;
        this.productId = converted.productId;
        this.regularPrice = converted.regularPrice;
        this.taxPercent = converted.taxPercent ?? 0;
        this.unit = converted.unit;
        this.currency = converted.currency;
        this.prices = prices ?? [];
        this.discounts = converted.discounts ?? [];
        this.useCustomPrice = converted.useCustomPrice;
        //this.items = converted.items?.map(e => new CartItem<TProduct>(this._controller, this, e.)) ?? [];


        // observables
        this._qty = converted.qty;
        this._price = converted.price;
        this._marking = converted.marking ?? '';
    }

    //private setValues(values: ICartItemData) {
    //    const prices = values?.prices.sort((a, b) => b.qty - a.qty);
    //    this.id = values.id;
    //    this.productId = values.productId;
    //    this.regularPrice = values.regularPrice;
    //    this.taxPercent = values.taxPercent;
    //    this.unit = values.unit;
    //    this.currency = values.currency;
    //    this.prices = prices;
    //    this.discounts = values.discounts;
    //    this.useCustomPrice = values.useCustomPrice;
    //    this.items = values.items?.map(e => new CartItem<TProduct>(this._controller, this, e)) ?? [];


    //    // observables
    //    this._qty = values.qty;
    //    this._price = values.price;
    //    this._marking = values.marking;
    //}

    // observable properties
    private _qty: number = 1;
    @computedFrom('_qty')
    public get qty() { return this._qty; };
    public set qty(value: number) {
        if (typeof value == 'string') {
            value = Number.parseFloat(value);
        }
        const prevData = this.export({ onlyToggled: false });
        this._qty = value;
        this.dispatchChange({
            type: 'item-change',
            property: 'qty',
            items: [{ current: this, prev: prevData }],
            shouldCalculate: true
        });
    }

    private _marking: string = '';
    @computedFrom('_marking')
    public get marking() { return this._marking; }
    public set marking(value: string) {
        const prevData = this.export({ onlyToggled: false });
        this._marking = value;
        this.dispatchChange({
            type: 'item-change',
            property: 'marking',
            items: [{ current: this, prev: prevData }],
            shouldCalculate: false
        });
    }

    private _price: number;
    @computedFrom('_price', 'useTax')
    public get price() { return this._price; }
    public set price(value: number) {
        if (typeof value == 'string') {
            value = Number.parseFloat(value);
        }
        const prevData = this.export({ onlyToggled: false });
        this._price = value;
        this.dispatchChange(
            {
                type: 'item-change',
                property: 'price',
                items: [{ current: this, prev: prevData }],
                shouldCalculate: true
            });
    }


    public toggle(value?: boolean) {
        if (typeof value != 'boolean') {
            value = !this.toggled;
        }

        this.toggled = value;
        this.items.forEach(i => i.toggle(this.toggled));
    }

    private convert(product: TProduct): CartItem<TProduct> {
        const converted = this._controller.converter(product);
        const item = new CartItem<TProduct>(this._controller, this, converted, product);
        item.product = product;

        return item;
    }

    public add(product: TProduct, quantity: number = 1) {
        const item = this.convert(product);
        const currentItem = this.items.find(e => e.productId == item.productId);
        if (currentItem) {
            //const prevData = currentItem.export({ onlyToggled: false });
            currentItem.qty += quantity;
            //this.dispatchChange({
            //    type: 'item-change',
            //    property: 
            //    items: [{ current: currentItem, prev: prevData }]
            //});
        }
        else {
            this.addLine(item, quantity);
        }
    }

    public addLine(item: CartItem<TProduct>, quantity?: number) {
        if (quantity || quantity === 0) {
            item.qty = quantity;
        }
        this.items.push(item);

        this.dispatchChange({
            type: 'item-add',
            items: [{ current: item, prev: undefined }],
            shouldCalculate: true
        });
    }

    removeLine(item: ICartItemData) {
        const index = this.items.findIndex(e => e == item);
        const i = this.items[index];
        const prevValue = i.export({ onlyToggled: false });

        this.items.slice(index, 1);

        this.dispatchChange({
            type: 'item-remove',
            items: [{ current: undefined, prev: prevValue }],
            shouldCalculate: true
        });
    }

    remove() {
        this._owner.removeLine(this);
    }

    removeSelected() {
        for (const item of this.items) {
            item.removeSelected();
        }


    }


    private findPrice() {
        if (this.prices.length == 0) {
            return this._price;
        }

        const count = this._controller.getTotalProductCount(this.productId);
        const foundPrice = this.prices.find(e => e.qty <= count)?.price;

        return foundPrice ?? this._price;
    }


    public calculate() {
        let price: number = this._price;
        if (!this.useCustomPrice) {
            price = this.findPrice();
        }

        let lineDiscount: number = 0, lineTax: number = 0, lineNet: number = 0, lineSum: number = 0,
            totalTax: number = 0, totalDiscount: number = 0, totalNet: number = 0, totalSum: number = 0;


        const discountPerQty = this.discounts
            .reduce((sum, current) => sum + ((current.type == CartDiscountEnum.Percent ? price * current.value : current.value)), 0);


        lineDiscount = totalDiscount = discountPerQty * this.qty;
        lineNet = totalNet = (price * this.qty) - lineDiscount;
        lineTax = totalTax = lineNet * this.taxPercent;
        lineSum = totalSum = lineNet + lineTax;

        for (const item of this.items) {
            item.calculate();

            totalDiscount += item.totalDiscount;
            totalNet += item.totalNet;
            totalTax += item.totalTax;
            totalSum += item.totalSum;
        }

        this.lineDiscount = lineDiscount;
        this.lineNet = lineNet;
        this.lineTax = lineTax;
        this.lineSum = lineSum;

        this.totalDiscount = totalDiscount;
        this.totalNet = totalNet;
        this.totalTax = totalTax;
        this.totalSum = totalSum;
    }



    public export(opts: ICartItemExportOptions): Required<ICartItemData> {
        let items = this.items;
        if (opts.onlyToggled) {
            items = items.filter(e => e.toggled);
        }

        return {
            id: this.id,
            productId: this.productId,
            qty: this.qty,
            regularPrice: this.regularPrice,
            price: this.price,
            taxPercent: this.taxPercent,
            marking: this.marking,

            unit: this.unit ?? '',
            currency: this.currency ?? '',

            prices: this.prices.slice(),
            discounts: this.discounts.slice(),
            items: items.map(i => i.export(opts)),

            useCustomPrice: this.useCustomPrice
        };
    }


    dispatchChange(event: ICartEvent) {
        this._controller.dispatchChange(event);
    }




}

export interface ICartItemExportOptions {
    onlyToggled: boolean;
    // removeAfterExport?
}

