import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    
        // Удаляем класс 'page__wrapper_locked' Не придумала более изящного решения, если при закрытии модального окна принудительно не прописать удаление класса, то прокрутка не работает. Посмотри в Page и исправь
        const pageWrapper = document.querySelector('.page__wrapper');
        if (pageWrapper) {
            pageWrapper.classList.remove('page__wrapper_locked');
        }
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();

        // // Добавляем обработчик для кнопки "в корзину" после рендеринга контента (для того, чтобы модалка закрывалась после нажатия на кнопку купить)
        // const addToCartButton = document.querySelector('.button');
        // if (addToCartButton) {
        //     addToCartButton.addEventListener('click', () => {
        //         this.close();
        //     });
        // }

        return this.container;
    }
}