import { IProduct, IAppState, IOrder } from '../types';
import { Model } from './base/Model';

export class ProductItem extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}  

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: IProduct[];
    loading: boolean;
    order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: null,
        items: []
    };

    productList(items: IProduct[]) {
        this.catalog = items.map((item) => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }


    // toggleOrderedLot(id: string, isIncluded: boolean) {
    //     if (isIncluded) {
    //         this.order.items = _.uniq([...this.order.items, id]);
    //     } else {
    //         this.order.items = _.without(this.order.items, id);
    //     }
    // }

    //Это точно нужно
    // clearBasket() {
    //     this.order.items.forEach(id => {
    //         this.toggleOrderedLot(id, false);
    //         this.catalog.find(it => it.id === id).clearBid();
    //     });
    // }

    // getTotal() {
    //     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    // }

    // setCatalog(items: ILot[]) {
    //     this.catalog = items.map(item => new LotItem(item, this.events));
    //     this.emitChanges('items:changed', { catalog: this.catalog });
    // }

    // setPreview(item: LotItem) {
    //     this.preview = item.id;
    //     this.emitChanges('preview:changed', item);
    // }

    // getActiveLots(): LotItem[] {
    //     return this.catalog
    //         .filter(item => item.status === 'active' && item.isParticipate);
    // }

    // getClosedLots(): LotItem[] {
    //     return this.catalog
    //         .filter(item => item.status === 'closed' && item.isMyBid)
    // }

    // setOrderField(field: keyof IOrderForm, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this.order);
    //     }
    // }

    // (Валидация полностью верная)
    // validateOrder() {
    //     const errors: typeof this.formErrors = {};
    //     if (!this.order.email) {
    //         errors.email = 'Необходимо указать email';
    //     }
    //     if (!this.order.phone) {
    //         errors.phone = 'Необходимо указать телефон';
    //     }
    //     this.formErrors = errors;
    //     this.events.emit('formErrors:change', this.formErrors);
    //     return Object.keys(errors).length === 0;
    // }
}