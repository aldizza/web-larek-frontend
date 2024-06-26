import { ISettings } from '../types';

// Используется для запросов данных и отправки заказа
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;

// Используется для формирования адреса картинки в товаре
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// export const settings = {

// };

// Настройки для приложения
export const SETTINGS: ISettings = {
    categorySettings: {
        другое: 'card__category_other',
        'софт-скил': 'card__category_soft',
        дополнительное: 'card__category_additional',
        кнопка: 'card__category_button',
        'хард-скил': 'card__category_hard',
    }
};