
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    button: string;
};

export interface ProductListRes {
    total: number;
    items: IProduct[];
};

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IAppState {
	list: IProduct[];
	preview: string | null;
	basket: IProduct[];
	order: IOrder | null;
}

export type CategoryProperty = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface ISettings {
    categorySettings: {
        'софт-скил': string;
        'другое': string;
        'дополнительное': string;
        'кнопка': string;
        'хард-скил': string;
    };
}

interface IModal {
    isOpen: boolean;
    openModal(data?: any): void;
    closeModal(): void;
    render(element: HTMLElement): void;
}

// Тип способа оплаты заказа
export type PaymentMethod = 'онлайн' | '' | 'при получении';

// Тип для заказа с формой оплаты и адреса
export type TPaymentForm = Pick<IOrder, 'payment' | 'address'>;

// Тип для заказа с формой почты и телефона
export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

export type TOrderField = TContactsForm & TPaymentForm;

// Тип для представления ошибок валидации формы на основе ключей из IOrder
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс заказа
export interface IOrderResult {
	id: string;
	total: number;
}


// Слой представления
// Интерфейс компонента форм
export interface IForm {
	valid: boolean;
	errors: string[];
}

// Интерфейс компонента страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Интерфейс компонента модального окна
export interface IModalData {
	content: HTMLElement;
}

// Интерфейс компонента успешного оформления заказа
export interface ISuccess {
	total: number;
}
export interface ISuccessActions {
	onClick: () => void;
}
