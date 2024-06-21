// (Переписать и переименовать переменные)



import { TPaymentForm , TContactsForm } from '../../types';
import { IEvents } from '../base/events';
import { Form } from './Form';

export class Payment extends Form<TPaymentForm> {
	protected buttonOnline: HTMLButtonElement;
    protected buttonCOD: HTMLButtonElement;
    protected _address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.buttonOnline = container.elements.namedItem('card') as HTMLButtonElement;
		this.buttonCOD = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this.buttonOnline) {
			this.buttonOnline.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonOnline.name,
					button: this.buttonOnline,
				});
			});
		}

		if (this.buttonCOD) {
			this.buttonCOD.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonCOD.name,
					button: this.buttonCOD,
				});
			});
		}

        this._address = container.elements.namedItem('address') as HTMLInputElement;

	}

    set address(value: string) {
        const addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
        if (addressInput) {
            addressInput.value = value;
        }
    }

	togglePayment(value: HTMLElement) {
		this.resetButtonState();
		this.toggleClass(value, 'button_alt-active', true);
	}

	resetButtonState() {
		this.toggleClass(this.buttonCOD, 'button_alt-active', false);
		this.toggleClass(this.buttonOnline, 'button_alt-active', false);
	}
}

export class Contacts extends Form<TContactsForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = container.elements.namedItem('email') as HTMLInputElement;
		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
	}
	set email(value: string) {
		this._email.value = value;
	}
	set phone(value: string) {
		this._phone.value = value;
	}
}