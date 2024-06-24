import { IProduct, IAppState, IOrder, TOrderField, FormErrors } from '../types';
import { Model } from './base/Model';

// Класс отдельной карточки
export class ProductItem extends Model<IProduct> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
	button: string;
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[] = [];
	basket: IProduct[] = [];
	preview: string | null;
	order: IOrder = {
		total: 0,
		items: [],
		email: '',
		phone: '',
		address: '',
		payment: '',
	};

    formErrors: FormErrors = {};

    setCatalog(items: IProduct[]) {
        this.catalog = items.map((item) => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

    getButtonStatus(item: IProduct) {
		if (item.price === null) {
			return 'Бесценно';
		}
		if (!this.basket.some((card) => card.id == item.id)) {
			return 'В корзину';
		} else {
			return 'Убрать';
		}
	}

    toggleBasketCard(item: IProduct) {
		return !this.basket.some((card) => card.id === item.id)
			? this.addCardToBasket(item)
			: this.removeCard(item);
	}

    addCardToBasket(item: IProduct) {
		this.basket = [...this.basket, item];
		this.emitChanges('basket:changed');
	}

	removeCard(item: IProduct) {
		this.basket = this.basket.filter((card) => card.id !== item.id);
		this.emitChanges('basket:changed');
	}

    getCardIndex(item: IProduct) {
		return Number(this.basket.indexOf(item)) + 1;
	}

    clearOrder() {
		this.order = {
			total: 0,
			items: [],
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
	}

    clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed');
	}

	setBasketToOrder() {
		this.order.items = this.basket.map((card) => card.id);
		this.order.total = this.getTotalCount();
	}

    getTotalCount() {
		return this.basket.reduce((total, card) => total + card.price, 0);
	}

    setOrderPayment(value: string) {
		this.order.payment = value;
	}

	setOrderAddress(value: string) {
		this.order.address = value;
	}

	setOrderPhone(value: string) {
		this.order.phone = value;
	}

	setOrderEmail(value: string) {
		this.order.email = value;
	}

    setOrderField(field: keyof TOrderField, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

    validateOrder() {
        const errors: typeof this.formErrors = {};
    
        const addressPattern = /^[A-Za-zА-Яа-я0-9\s,.-]{10,}$/;
        const emailPattern = /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!emailPattern.test(this.order.email)) {
            errors.email = 'Некорректный формат email';
        }
    
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!phonePattern.test(this.order.phone)) {
            errors.phone = 'Некорректный формат телефона, введите в формате +7(ХХХ)ХХХ-ХХ-ХХ';
        }
    
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        } else if (!addressPattern.test(this.order.address)) {
            errors.address = 'Некорректный формат адреса, введите не менее 10 символов';
        }
    
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
    
        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
    
}