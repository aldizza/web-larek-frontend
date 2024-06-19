# Проектная работа "Веб-ларек"
https://github.com/aldizza/web-larek-frontend

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс для описания карточки товара.\
Этот интерфейс описывает базовую структуру объекта товара. Он будет использоваться для хранения основной информации о товаре, такой как уникальный идентификатор товара (id), описание (description:), изображение (image), название(title), категория (category), цена (price). Этот интерфейс будет использоваться для типизации данных о товарах, которые получаем из API.

```
export interface Product {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Интерфейс для описания карточки товара в корзине.\
Этот интерфейс расширяет Product и добавляет дополнительное поле, в котором отображается состояние товара (товар в корзине).

```
export interface ProductCard extends Product {
    isInBasket?: boolean;
}
```

Интерфейс для описания ответа на запрос списка товаров.\
Этот интерфейс используется для описания ответа на запрос списка товаров. Он включает общее количество товаров в списке и массив с информацией о каждом товаре (используя интерфейс Product).

```
export interface ProductListRes {
    total: number;
    items: Product[];
}
```

Интерфейс для описания заказа.\
Этот интерфейс описывает структуру заказа. Он включает информацию о способе оплаты (payment), контактные данные покупателя (email, номер телефона), адрес доставки (address), общую стоимость заказа (total) и список идентификаторов товаров (items).

```
export interface Order {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```

Интерфейс для описания ответа на успешное создание заказа.\
Этот интерфейс используется для описания ответа на успешное создание заказа. Он содержит уникальный идентификатор созданного заказа и общую стоимость заказа.

```
export interface OrderSuccessRes {
    id: string;
    total: number;
}
```

Общий интерфейс для всех модальных окон.

```
export interface Modal {
    isOpen: boolean;
    openModal(data?: any): void;
    closeModal(): void;
    render(element: HTMLElement): void;
}
```

## Архитектура приложения

Приложение разбито на слои согласно парадигме MVP: базовые классы, данные, представления (отображения или View), слой коммуникации, список событий. Слой Presenter не выделяется в отдельные классы и будет реализован в index.ts.

### Базовый код

#### Класс Api
Предоставляет интерфейс для выполнения HTTP-запросов GET и POST к указанному базовому URL. 
Методы:
- `get` - отправляет GET-запрос на указанный URI;
- `post` - отправляет POST-запрос на указанный URI с предоставленными данными.

#### Класс "EmitterEvent"
Реализует интерфейс IEvents и обеспечивает работу событий. Функции брокера события: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события».
Методы:
- `on` - устанавливает обработчик на указанное событие;
- `off` - удаляет обработчик с указанного события;
- `emit` - инициирует событие с указанным именем и данными;
- `onAll` - устанавливает обработчик, который будет вызываться для всех событий;
- `offAll()` - cбрасывает все обработчики событий;
- `trigger` - cоздает функцию-триггер, которая генерирует событие при вызове.


### Слой данных. Классы и описание модели данных

!!!!!!!!! Конструктор класса инициализирует все свойства объекта заказа. 
Наталья, чтобы описать класс, вам нужно понять, какие данные будут храниться в полях класса и какие методы будут у класса, чтобы с этими данными работать.
Вот эти методы вам нужно описать в каждом классе. !!!!!!!

#### Класс OrderSuccessRes
Класс для описания ответа на успешное создание заказа.
В полях класса хранятся следующие данные:
- id: string - уникальный идентификатор товара;
- total: number - общая сумма заказа.
Конструктор инициалирует объект OrderSuccessRes.

#### Класс ErrorRes
Класс для описания ответа с ошибкой.\
Этот класс предоставляет способ создания объектов, которые содержат информацию об ошибке. Когда объект создается, он принимает строку с описанием ошибки и сохраняет ее в свойстве `error`.\
Конструктор класса ErrorRes инициализирует новый объект типа ErrorRes с заданным текстом ошибки.

### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.\
В проекте 5 модальных окон (товара, корзины,  форма оплаты, форма контактов и успешная покупка).

#### класс Modal 
Родительский класс. Позволяет вынести общий функционал для всех модальных окон. Устанавливает слушатель на кнопку-крестик и по клику вне модального окна для закрытия попапа. Конструктор принемает селектор, при помощи которого будет идентефицировано модальное окно и `EmitterEvent` для инициации событий.\
Ключевые методы: 
openModal(): void - открывает модальное окно;
closeModal(): void - закрывает модальное окно;
render(element: HTMLElement): void - метод для рендеринга модального окна;
protected abstract getModalContent(): string - абстрактный метод, который должен возвращать HTML-контент для отображения в модальном окне;
protected abstract renderContent(data: any): void - абстрактный метод, который должен обновлять состояние модального окна на основе переданных данных.

#### Класс OrderSuccess
Этот класс наследуется от Modal генерирует разметку и возвращает ее из метода render().
Далее эта разметка используется для отображения в модальном окне.\
Методы:
- displaySuccessMessage() - отображает сообщение об успешном заказе.
- closeSuccessMessage() -  закрывает сообщение об успешном заказе и переходит к новым покупкам.

#### Класс CardCatalog
Этот класс наследуется от Modal генерирует разметку и возвращает ее из метода render().
Далее эта разметка используется для отображения в модальном окне.\
Методы:
- displayCard() - отображает карточку элемента в каталоге с соответствующей информацией.

#### Класс CardPreview
Этот класс наследуется от Modal генерирует разметку и возвращает ее из метода render().
Далее эта разметка используется для отображения в модальном окне.\
Методы:
- displayPreview() - отображает предпросмотр карточки с информацией.

#### Класс Basket
Расширяет класс Modal. Этот класс управляет отображением корзины с добавленными товарами.\
Методы:
- displayBasket() - отображает содержимое корзины с соответствующей информацией;
- submitOrderForm() -  отправляет данные формы заказа для обработки.

#### Класс OrderForm
Расширяет класс Modal. Этот класс представляет форму c выбором способа оплаты (онлайн/при получении) и полем "Адрес доставки". При нажатии на кнопку "Далее" инициирует событие передавая в него обьект с данными из полей ввода формы.\
Поля класса:
- submitButton: HTMLButtonElement - кнопка "Далее".
- inputs: {address: string} - объект для хранения полей ввода формы
- errors: Record<string, HTMLElement> - обьект хранящий все элементы для вывода ошибок под полями формы.

Методы:
- validateOrderForm() - проверяет заполненность формы заказа;
- setValid(isValid: boolean): void - изменяет состояние кнопки "Далее";
- submitOrderForm() -  отправляет данные формы заказа для обработки.

#### Класс ContactForm
Расширяет класс Modal. Этот класс представляет форму для ввода контактной информации пользователя (email и телефон).\
Поля класса:
- submitButton: HTMLButtonElement - кнопка "Оплатить".
- inputs: {email: string, phone: string} - объект для хранения полей ввода формы
- errors: Record<string, HTMLElement> - обьект хранящий все элементы для вывода ошибок под полями формы.
Методы:
- setValid(isValid: boolean): void - изменяет состояние кнопки "Оплатить";
- submitContactForm() - отправляет данные формы контактов для обработки.

### Слой коммуникации

#### Класс AppApi 
Принемает в конструктор экземпляр класса Api и представляет методы реализации взаимодействия с беккендом сервиса.

## Взаимодействие компанентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющим роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих мобытий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.\
Компонент Hero отображает контент в виде любого другого произвольного компонента, в частности на странице используется компонент Film, и кнопка действия, используя компонент Button.\
В работе используется событийно-ориентированный подход. Презентер содержит обработчики событий, которые генерируются компонентами других слоев. 


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами моделями данных)*
- `cardPreview:open` - при нажатии на карточку товара открывается модальное окно с детальной информацией о товаре;
- `card:select` - выбор карточки для отображения в модальном окне;
- `cardBasket:open` - при нажатии на иконку корзины, открывается корзина;
- `order-buy:submit` - при нажатии на кнопку «Купить» товар добавляется в корзину, если не был добавлен в корзину раньше;
при нажатии на кнопку «Убрать» товар удаляется из корзины.
выбор способа оплаты;
- `order-adress:input` - ввод адреса доставки;
- `order-email:input` - ввод электронной почты покупателя;
- `order-phone:input` - ввод телефона покупателя;
- `order-success:submit` - при нажатии на кнопку оплаты появляется сообщение об успешной оплате и товары удаляются из корзины.
- `order-adress:validation` - если адрес доставки не введён, появляется сообщение об ошибке
- `order-mail:validation`если поле ввода электронной почты покупателя не заполнено, появляется сообщение об ошибке;
- `order-phone:validation` - если поле ввода телефона покупателя не заполнено, появляется сообщение об ошибке;
