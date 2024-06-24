import './scss/styles.scss';
import { WebLarekAPI } from "./components/WebLarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { ProductItem, ProductItemPreview as CardItemPreview } from './components/Card';
import { AppState } from './components/Appdata';
import { Page } from './components/Page';
import { IProduct, IOrder } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { Success } from './components/common/Success';
import { BasketCard, Card } from './components/Card';
import { Order as Order, Contacts } from './components/common/Order';


const events = new EventEmitter();
const api = new WebLarekAPI(API_URL, CDN_URL);

//Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
//центральная точка для управления данными и состоянием приложения, и его методы и свойства будут использоваться для взаимодействия с этими данными и обеспечения согласованного состояния приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);

// Бизнес-логика (поймали событие, сделали что нужно)

// Изменились элементы каталога

events.on('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new ProductItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price,
        });
    });
});

//  Открытие карточки

events.on('card:select', (item: ProductItem) => {
    const card = new CardItemPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => { events.emit('card:addToBasket', item) },
    });

    modal.render({
      content: card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price,
      }),
    });
});

// button: appData.getButtonStatus(item),


// Добавление карточки в корзину
events.on('card:addToBasket', (item: IProduct) => {
	appData.toggleBasketCard(item);
    events.emit('basket:open');
});

// Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Обновление интерфейса корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.length;
	basket.sum = appData.getTotalCount();
	basket.items = appData.basket.map((basketCard) => {
		const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.removeCard(basketCard);
			},
		});
		newBasketCard.index = appData.getCardIndex(basketCard);
		return newBasketCard.render({
			title: basketCard.title,
			price: basketCard.price,
		});
	});
});

// Открытие формы заказа
events.on('order:open', () => {
	order.resetButtonState();
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменения в заказе
events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
	order.togglePayment(data.button);
	appData.setOrderPayment(data.payment);
	appData.validateOrder();
});

events.on('order.address:change', (data: {field: keyof Pick<IOrder, 'address'>;
		value: string;}) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(/contacts\.(phone|email):change/, (data: {field: keyof Pick<IOrder, 'phone' | 'email'>; value: string;}) => {
		appData.setOrderField(data.field, data.value);
	}
);
  
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');

    contact.valid = !email && !phone;
    contact.errors = Object.values({ email, phone })
        .filter((i) => !!i)
        .join('; ');
});

// Подтверджение формы оплаты
events.on('order:submit', () => {
	modal.render({
		content: contact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Подтверджение формы контактов
events.on('contacts:submit', () => {
	appData.setBasketToOrder();
	api
		.orderProducts(appData.order)
		.then((result) => {
			const successWindow = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.closeModal();
				},
			});
			appData.clearBasket();
			appData.clearOrder();

			modal.render({ content: successWindow.render({ total: result.total }) });
		})
		.catch((err: any) => {
			console.error(`Ошибка выполнения заказа ${err}`);
		});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });



















