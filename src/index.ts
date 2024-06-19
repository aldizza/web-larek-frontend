import './scss/styles.scss';
import { API_URL } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { ProductItem, ProductItemPreview } from './components/Card';
import { AppState } from './components/Appdata';
import { Page } from './components/Page';
import { Api } from './components/base/api';
import { ProductListResponse, IProduct } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";


const events = new EventEmitter();
const api = new Api(API_URL);

//Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(cardBasketTemplate), events);
// const order = new Order(cloneTemplate(orderTemplate), events);
// const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
// const success = new Success(cloneTemplate(successTemplate), {
//   onClick: () => {
//     events.emit('modal:close')
//     modal.close()
//   }
// })

//Cписок продуктов с сервера
api.get('/product')
  .then((res: ProductListResponse) => {
    appData.productList(res.items as IProduct[]);
  })
  .catch((err) => {
    console.error(err);
  });

// Бизнес-логика (поймали событие, сделали что нужно)

// Изменились элементы каталога
events.on('items:changed', () => {
    page.catalog = appData.catalog.map((item) => {
        const product = new ProductItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
    });
    return product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Открытие карточки и блокировка прокрутки страницы если открыта модалка
events.on('card:select', (item: ProductItem) => {
    page.locked = true;
    const product = new ProductItemPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => { events.emit('card:addToBasket', item)},
    });

    modal.render({
      content: product.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price,
        // selected: item.selected
      }),
    });
});

// // Закрытие карточки и разблокировка страницы
// events.on('card:unselect', () => {
//     page.locked = false;
//     modal.close();
// });

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Изменение данных корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
	basket.sum = appData.getBasketTotal();
	basket.items = appData.basket.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteCardFromBasket(basketCard);
			},
		});
		newBasketCard.index = appData.getCardIndex(basketCard);
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});





// Открытие корзины
// events.on('basket:open', () => {
//     page.locked = true
//     const basketItems = appData.basket.map((item, index) => {
//       const storeItem = new StoreItemBasket(
//         'card',
//         cloneTemplate(cardBasketTemplate),
//         {
//           onClick: () => events.emit('basket:delete', item)
//         }
//       );
//       return storeItem.render({
//         title: item.title,
//         price: item.price,
//         index: index + 1,
//       });
//     });
//     modal.render({
//       content: basket.render({
//         list: basketItems,
//         price: appData.getTotalPrice(),
//       }),
//     });
//   });

