import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { ICardActions } from '../Card';
import { IProduct } from '../../types';
import { AppState } from '../Appdata';


interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {
        super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		
        if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

        this.items = [];
	}

    set sum(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
	
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
			this.setDisabled(this._button, false); // Кнопка активируется
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
			this.setDisabled(this._button, true); // Кнопка деактивируется
        }
    }

    set selected(items: string[]) {
        this.setDisabled(this._button, items.length === 0);
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}


