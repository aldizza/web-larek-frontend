import { Api, ApiListResponse } from './base/api';
import { IOrder, IProduct, IOrderResults } from "../types";

// Определяем интерфейс для API
export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;  // Метод для получения списка продуктов
    getProductItem: (id: string) => Promise<IProduct>;  // Метод для получения конкретного продукта по id
    orderProducts: (order: IOrder) => Promise<IOrderResults>;  // Метод для размещения заказа продуктов
}

// Реализуем класс, который расширяет Api и реализует интерфейс IWebLarekAPI
export class WebLarekAPI extends Api implements IWebLarekAPI {
    // readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);  // Вызываем конструктор базового класса Api
        // this.cdn = cdn;  // Инициализируем cdn для работы с изображениями
    }

    getProductItem(id: string): Promise<IProduct> {
        // Получаем конкретный продукт по его id и добавляем CDN к его изображению
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: item.image,
            })
        );
    }

    getProductList(): Promise<IProduct[]> {
        // Получаем список продуктов и добавляем CDN к изображению каждого продукта
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: item.image
            }))
        );
    }

    orderProducts(order: IOrder): Promise<IOrderResults> {
        // Отправляем заказ продуктов на сервер и возвращаем результат заказа
        return this.post('/order', order).then(
            (data: IOrderResults) => data
        );
    }
}
