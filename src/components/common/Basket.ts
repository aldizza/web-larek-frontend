import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import { ICardActions } from '../Card';


interface IBasketView {
    items: HTMLElement[];
    total: number;
    // selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
	protected _sum: HTMLElement;
	protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {
        super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._sum = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
		
        if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

        this.items = [];
	}

    set sum(total: number) {
		this.setText(this._sum, `${total} синапсов`);
	}
	

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

//     set selected(items: string[]) {
//         if (items.length) {
//             this.setDisabled(this._button, false);
//         } else {
//             this.setDisabled(this._button, true);
//         }
//     }

//     set total(tota sl: number) {
//         this.setText(this._total, formatNumber(total));
//     }
};