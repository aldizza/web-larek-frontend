import { IProduct } from '../types';
import { Component } from './base/Component';
import { CategoryProperty } from '../types';
import { ensureElement } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { SETTINGS } from '../utils/constants';

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
  protected _description: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(container);
    // this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    // this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._title = container.querySelector(`.${blockName}__title`);                                           
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  //Как в Оно
  set id(value: string) {
    this.container.dataset.id = value;
  }

  //Как в Оно
  get id(): string {
    return this.container.dataset.id || '';
  }

  //Как в Оно
  set title(value: string) {
    this._title.textContent = value;
  }
  
  //Как в Оно
  get title(): string {
    return this._title.textContent || '';
  }
  
  //Как в Оно
  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

  set disabled(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }

  set price(value: number | null) {
    // this._price.textContent = value;
    if (value !== null) {
      this._price.textContent = `${cardPrice(value)} синапсов`;
  } else {
      this._price.textContent = 'Бесценно';
  }
  
  if (this._button && !value) {
      this._button.disabled = true;
  }
  }
  
  // get price(): number {
	// 	return parseFloat(this._price.textContent || '0');
	// }

  set category(value: CategoryProperty) {
    this._category.textContent = value;
    this._category.classList.add(SETTINGS.categorySettings[value]);
  }

}

function cardPrice(value: number): string {
  return `${value}`; 
}

export class ProductItem extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}

export class ProductItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}

export class BasketCard extends Card {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);
		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}
	set index(value: number) {
		this.setText(this._index, value);
	}
}