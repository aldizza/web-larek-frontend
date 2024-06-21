import './scss/styles.scss';
import { WebLarekAPI } from "./components/WebLarekAPI";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { ProductItem, ProductItemPreview as CardItemPreview } from './components/Card';
import { AppState } from './components/Appdata';
import { Page } from './components/Page';
import { Api } from './components/base/api';
import { ProductListResponse, IProduct } from './types';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Modal } from "./components/common/Modal";
import { Basket } from "./components/common/Basket";
import { Success } from './components/common/Success';
import { BasketCard, Card } from './components/Card';
import { IOrder } from "./types";
import { Payment as Order, Contacts } from './components/common/Order';


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
//центральная точка для управления данными и состоянием приложения в вашем коде, и его методы и свойства будут использоваться для взаимодействия с этими данными и обеспечения согласованного состояния приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);

// const success = new Success(cloneTemplate(successTemplate), {
//   onClick: () => {
//     events.emit('modal:close')
//     modal.close()
//   }
// })

api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

// Бизнес-логика (поймали событие, сделали что нужно)

// Изменились элементы каталога

//Из Оно, проверять не надо
//При событии items:changed происходит обновление списка продуктов на странице page.catalog.
// Каждый продукт (ProductItem) отображается с использованием шаблонов и данных из массива appData.catalog.
// При клике на продукт генерируется событие card:select
// Метод render вызывается для каждого ProductItem, чтобы преобразовать данные продукта (id, title, image, category, price) в HTML, который будет отображен на странице.

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


//  Открытие карточки и блокировка интерфейса

//Когда событие card:select происходит, выполняется функция обратного вызова, которая принимает один аргумент item (должен быть объектом, который содержит все перечисленные свойства и типы ProductItem)
//page.locked = true используется для блокировки интерфейса во время отображения модального окна.
//Устанавливается обработчик клика (onClick). При клике на предварительный просмотр карточки будет вызываться событие 'card:addToBasket', которое передает объект item в качестве параметра.
//Вызывается метод render модального окна (modal), которое отображает содержимое предварительного просмотра продукта.

events.on('card:select', (item: ProductItem) => {
    page.locked = true;
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
        // selected: item.selected
      }),
    });
});

// // Отправка карточки в корзину
events.on('card:addToBasket', (item: IProduct) => {
	appData.toggleBasketCard(item);
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

// Изменилось одно из полей
// Этот код подписывается на события, имена которых соответствуют шаблону order.*:changed. Когда такое событие происходит, вызывается обработчик, который обновляет соответствующее поле в заказе с новым значением
// events.on(
// 	/^order\..*:change/,
// 	(data: {
// 		field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
// 		value: string;
// 	}) => {
// 		appData.setOrderField(data.field, data.value);
// 	}
// );

// Изменения в заказе
events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
	order.togglePayment(data.button);
	appData.setOrderPayment(data.payment);
	appData.validateOrder();
});

events.on(
	'order.address:change',
	(data: {
		field: keyof Pick<IOrder, 'address'>;
		value: string;
	}) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/contacts\.(phone|email):change/,
	(data: {
		field: keyof Pick<IOrder, 'phone' | 'email'>;
		value: string;
	}) => {
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
					modal.close();
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



















