import './scss/styles.scss';

export interface Product {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    address: string;
    email: string;
}

export interface ProductCard extends Product {
    isInBasket?: boolean;
}

export interface ProductListResponse {
    total: number;
    items: Product[];
}

export interface ProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface Order {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface OrderSuccessResponse {
    id: string;
    total: number;
}

export interface ErrorResponse {
    error: string;
}

interface Modal {
    isOpen: boolean;
    openModal(data?: any): void;
    closeModal(): void;
    render(element: HTMLElement): void;
}

export type TProductInfo = Pick<Product, 'category' | 'description' | 'title' | 'image' | 'price'>;

export type TCartInfo = Pick<Product, 'title' | 'price'>;

export type TPayInfo = Pick<Product, 'category' | 'description' | 'title' | 'image' | 'price'>;

export type TContactInfo = Pick<Product, 'email' | 'phone'>;

export interface ProductData {
    cards: Product[];
    preview: string | null;
    addProduct(product: Product): void;
    deleteProduct(productId: string, payload: Function | null): void;
}