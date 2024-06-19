export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
};

export interface ProductListResponse {
    total: number;
    items: IProduct[];
};

export interface IAppState {
    productList(items: IProduct[]): void;
};

export type CategoryProperty = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface Settings {
    categorySettings: {
        'софт-скил': string;
        'другое': string;
        'дополнительное': string;
        'кнопка': string;
        'хард-скил': string;
    };
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

interface Modal {
    isOpen: boolean;
    openModal(data?: any): void;
    closeModal(): void;
    render(element: HTMLElement): void;
}



// export interface ProductCard extends Product {
//     isInBasket?: boolean;
// }


// export interface OrderSuccessResponse {
//     id: string;
//     total: number;
// }

// export interface ErrorResponse {
//     error: string;
// }



// export type TProductInfo = Pick<Product, 'category' | 'description' | 'title' | 'image' | 'price'>;

// export type TCartInfo = Pick<Product, 'title' | 'price'>;

// export type TPayInfo = Pick<Product, 'category' | 'description' | 'title' | 'image' | 'price'>;

// // export type TContactInfo = Pick<Product, 'email' | 'phone'>;

// export interface ProductData {
//     cards: Product[];
//     preview: string | null;
//     addProduct(product: Product): void;
//     deleteProduct(productId: string, payload: Function | null): void;
// }