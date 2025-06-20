import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {RippleModule} from 'primeng/ripple';
import {SelectModule} from 'primeng/select';

@Component({
    selector: 'app-checkout-form',
    imports: [ButtonModule, RippleModule, SelectModule, CheckboxModule, InputTextModule, InputNumberModule, InputGroupModule, CheckboxModule, FormsModule],
    template: `
        <div class="card">
            <div class="grid grid-cols-12 gap-4 grid-nogutter">
                <div class="col-span-12 px-6 mt-6 md:mt-12 md:px-12">
                    <span class="text-surface-900 dark:text-surface-0 block font-bold text-xl">Checkout</span>
                </div>
                <div class="col-span-12 lg:col-span-6 h-full px-6 py-6 md:px-12">
                    <ul class="flex list-none flex-wrap p-0 mb-12">
                        <li class="flex items-center text-primary mr-2">
                            Cart
                            <i class="pi pi-chevron-right text-surface-500 dark:text-surface-300 text-xs ml-2"></i>
                        </li>
                        <li class="flex items-center text-surface-500 dark:text-surface-300 mr-2">Information<i class="pi pi-chevron-right text-surface-500 dark:text-surface-300 text-xs ml-2"></i></li>
                        <li class="flex items-center text-surface-500 dark:text-surface-300 mr-2">Shipping<i class="pi pi-chevron-right text-surface-500 dark:text-surface-300 text-xs ml-2"></i></li>
                        <li class="flex items-center text-surface-500 dark:text-surface-300 mr-2">Payment</li>
                    </ul>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 mb-12">
                            <span class="text-surface-900 dark:text-surface-0 text-2xl block font-medium mb-8">Contact Information</span>
                            <input id="email" placeholder="Email" type="text" class="p-inputtext w-full mb-6" />
                            <div class="flex items-center">
                                <p-checkbox name="checkbox-1" [(ngModel)]="checked" [binary]="true" inputId="id"></p-checkbox>
                                <label class="ml-2" for="checkbox-1">Email me with news and offers</label>
                            </div>
                        </div>
                        <div class="col-span-12 mb-6">
                            <span class="text-surface-900 dark:text-surface-0 text-2xl block font-medium mb-8">Shipping</span>
                            <p-select [options]="cities" [(ngModel)]="selectedCity" placeholder="Country / City" optionLabel="name" [showClear]="true" styleClass="w-full"></p-select>
                        </div>
                        <div class="col-span-12 lg:col-span-6 mb-6">
                            <input id="name" placeholder="Name" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 lg:col-span-6 mb-6">
                            <input id="lastname" placeholder="Last Name" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 mb-6">
                            <input id="address" placeholder="Address" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 mb-6">
                            <input id="address2" placeholder="Apartment, suite, etc" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 lg:col-span-6 mb-6">
                            <input id="pc" placeholder="Postal Code" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 lg:col-span-6 mb-6">
                            <input id="city" placeholder="City" type="text" class="p-inputtext w-full" />
                        </div>
                        <div class="col-span-12 lg:col-span-6 mb-6">
                            <div class="flex items-center">
                                <p-checkbox name="checkbox-2" [(ngModel)]="checked2" [binary]="true" inputId="id"></p-checkbox>
                                <label class="ml-2" for="checkbox-2">Save for next purchase</label>
                            </div>
                        </div>
                        <div class="col-span-12 flex flex-col lg:flex-row justify-center items-center lg:justify-end my-12">
                            <button pButton pRipple class="mt-4 lg:mt-0 w-full lg:w-auto order-2 lg:order-1 lg:mr-6" severity="secondary" label="Return to Cart" icon="pi pi-fw pi-arrow-left"></button>
                            <button pButton pRipple class="w-full lg:w-auto order-1 lg:order-2" label="Continue to Shipping" icon="pi pi-fw pi-check"></button>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-6 px-6 py-6 md:px-12">
                    <div class="pb-4 border-surface-200 dark:border-surface-700">
                        <span class="text-surface-900 dark:text-surface-0 font-medium text-xl">Your Cart</span>
                    </div>
                    <div class="flex flex-col lg:flex-row flex-wrap lg:items-center py-2 mt-4 border-surface-200 dark:border-surface-700">
                        <img src="/demo/images/ecommerce/shop/shop-1.png" class="w-32 h-32 flex-shrink-0 mb-4" alt="product" />
                        <div class="flex-auto lg:ml-4">
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-surface-900 dark:text-surface-0 font-bold">Product Name</span>
                                <span class="text-surface-900 dark:text-surface-0 font-bold">$123.00</span>
                            </div>
                            <div class="text-surface-600 dark:text-surface-200 text-sm mb-4">Black | Large</div>
                            <div class="flex flex-auto justify-between items-center">
                                <p-inputNumber
                                    [showButtons]="true"
                                    buttonLayout="horizontal"
                                    [min]="0"
                                    inputStyleClass="!w-10 text-center border-transparent outline-0 shadow-none"
                                    [(ngModel)]="quantities[0]"
                                    styleClass="border border-surface-200 dark:border-surface-700 rounded"
                                    decrementButtonClass="p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1"
                                    incrementButtonClass="p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                ></p-inputNumber>
                                <button pButton pRipple icon="pi pi-trash" text rounded></button>
                            </div>
                        </div>
                    </div>
                    <div class="py-2 mt-4 border-surface-200 dark:border-surface-700">
                        <p-inputGroup class="mt-4">
                            <input type="text" [(ngModel)]="value" pInputText placeholder="Promo code" class="w-full" />
                            <button type="button" pButton pRipple label="Apply" [disabled]="!value"></button>
                        </p-inputGroup>
                    </div>
                    <div class="py-2 mt-4">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-surface-900 dark:text-surface-0 font-medium">Subtotal</span>
                            <span class="text-surface-900 dark:text-surface-0">$123.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-surface-900 dark:text-surface-0 font-medium">Shipping</span>
                            <span class="text-primary font-bold">Free</span>
                        </div>
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-surface-900 dark:text-surface-0 font-bold">Total</span>
                            <span class="text-surface-900 dark:text-surface-0 font-medium text-xl">$123.00</span>
                        </div>
                    </div>
                    <div class="py-2 mt-4 bg-yellow-100 flex items-center justify-center rounded">
                        <img src="/demo/images/ecommerce/shop/flag.png" class="mr-2" alt="Country Flag" />
                        <span class="text-black/90 font-medium">No additional duties or taxes.</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CheckoutForm {
    quantities: number[] = [1, 1, 1];

    value: string = '';

    checked: boolean = true;

    checked2: boolean = true;

    cities = [
        { name: 'USA / New York', code: 'NY' },
        { name: 'Italy / Rome', code: 'RM' },
        { name: 'United Kingdoom / London', code: 'LDN' },
        { name: 'Turkey / Istanbul', code: 'IST' },
        { name: 'France / Paris', code: 'PRS' }
    ];

    selectedCity: string = '';
}
