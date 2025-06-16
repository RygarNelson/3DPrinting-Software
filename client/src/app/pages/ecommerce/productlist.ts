import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {RippleModule} from 'primeng/ripple';
import {TabsModule} from 'primeng/tabs';

@Component({
    selector: 'app-product-list',
    imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule, RippleModule, TabsModule],
    template: `
        <div class="card">
            <div class="text-surface-900 dark:text-surface-0 font-medium text-4xl mb-6">Popular Products</div>
            <p class="mt-0 p-0 mb-8 text-surface-700 dark:text-surface-100 text-2xl">Exclusive Selection</p>
            <div class="grid grid-cols-12 gap-4 -mt-4 -ml-4 -mr-4">
                <div class="col-span-12 md:col-span-6 lg:col-span-4" *ngFor="let product of products">
                    <div class="p-2">
                        <div class="shadow p-6 bg-surface-0 dark:bg-surface-900 rounded">
                            <div class="relative mb-4">
                                <span class="bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-0 shadow px-4 py-2 absolute rounded-3xl" style="left: 1rem; top: 1rem">Category</span>
                                <img [src]="product.image" class="w-full" />
                            </div>
                            <div class="flex justify-between items-center mb-4">
                                <span class="text-surface-900 dark:text-surface-0 font-medium text-xl">Product Name</span>
                                <span>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <span class="font-medium">5.0</span>
                                </span>
                            </div>
                            <p class="mt-0 mb-4 text-surface-700 dark:text-surface-100 leading-normal">Enim nec dui nunc mattis enim ut tellus. Tincidunt arcu.</p>
                            <span class="text-primary text-xl font-medium">{{ product.price }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="grid grid-cols-12 gap-4 -mt-4 -ml-4 -mr-4">
                <div class="col-span-12 md:col-span-6 lg:col-span-3 mb-8 lg:mb-0" *ngFor="let product of products2">
                    <div class="mb-4 relative">
                        <img [src]="product.image" class="w-full" />
                        <button
                            type="button"
                            pRipple
                            class="border !border-white rounded py-2 px-4 !absolute !bg-black/30 !text-white inline-flex items-center justify-center hover:bg-black/40 transition-colors duration-300 cursor-pointer"
                            style="bottom: 1rem; left: 1rem; width: calc(100% - 2rem)"
                        >
                            <i class="pi pi-shopping-cart mr-4 text-base"></i>
                            <span class="text-base">Add to Cart</span>
                        </button>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-xl text-surface-900 dark:text-surface-0 font-medium mb-4">Product Name</span>
                        <span class="text-xl text-surface-900 dark:text-surface-0 mb-4">$150.00</span>
                        <div class="flex items-center mb-4">
                            <div
                                class="w-8 h-8 flex-shrink-0 rounded-full bg-slate-500 mr-4 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                                [ngStyle]="{
                                    'box-shadow': product.color === 'Bluegray' ? '0 0 0 0.2rem var(--p-gray-500)' : null
                                }"
                                (click)="product.color = 'Bluegray'"
                            ></div>
                            <div
                                class="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-500 hover:border-indigo-500 mr-4 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                                [ngStyle]="{
                                    'box-shadow': product.color === 'Indigo' ? '0 0 0 0.2rem var(--p-indigo-500)' : null
                                }"
                                (click)="product.color = 'Indigo'"
                            ></div>
                            <div
                                class="w-8 h-8 flex-shrink-0 rounded-full bg-purple-500 hover:border-purple-500 mr-4 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                                [ngStyle]="{
                                    'box-shadow': product.color === 'Purple' ? '0 0 0 0.2rem var(--p-purple-500)' : null
                                }"
                                (click)="product.color = 'Purple'"
                            ></div>
                            <div
                                class="w-8 h-8 flex-shrink-0 rounded-full bg-cyan-500 hover:border-cyan-500 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                                [ngStyle]="{
                                    'box-shadow': product.color === 'Cyan' ? '0 0 0 0.2rem var(--p-cyan-500)' : null
                                }"
                                (click)="product.color = 'Cyan'"
                            ></div>
                        </div>
                        <span class="text-surface-700 dark:text-surface-100">{{ product.color }}</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ProductList {
    color1: string = 'Bluegray';

    products = [
        {
            price: '$140.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-1.png'
        },
        {
            price: '$82.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-2.png'
        },
        {
            price: '$54.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-3.png'
        },
        {
            price: '$72.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-4.png'
        },
        {
            price: '$99.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-5.png'
        },
        {
            price: '$89.00',
            image: '/demo/images/ecommerce/product-list/product-list-4-6.png'
        }
    ];

    products2 = [
        {
            color: 'Bluegray',
            image: '/demo/images/ecommerce/product-list/product-list-2-1.png'
        },
        {
            color: 'Indigo',
            image: '/demo/images/ecommerce/product-list/product-list-2-2.png'
        },
        {
            color: 'Purple',
            image: '/demo/images/ecommerce/product-list/product-list-2-3.png'
        },
        {
            color: 'Cyan',
            image: '/demo/images/ecommerce/product-list/product-list-2-4.png'
        }
    ];
}
