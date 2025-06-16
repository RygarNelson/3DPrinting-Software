import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {DividerModule} from 'primeng/divider';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';

@Component({
    selector: 'app-order-history',
    imports: [DividerModule, IconFieldModule, InputIconModule, CommonModule],
    template: `
        <div class="card">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                <div class="flex flex-col text-center md:text-left">
                    <span class="text-surface-900 dark:text-surface-0 text-2xl mb-2">My Orders</span>
                    <span class="text-surface-600 dark:text-surface-200 text-lg">Dignissim diam quis enim lobortis.</span>
                </div>
                <p-iconfield class="mt-8 mb-2 md:mt-0 md:mb-0 w-full lg:w-[25rem]">
                    <p-inputicon class="pi pi-search text-gray-400" />
                    <input type="text" class="p-inputtext w-full lg:w-[25rem] bg-surface-50 dark:bg-surface-800" placeholder="Search" />
                </p-iconfield>
            </div>
            <div class="bg-surface-0 dark:bg-surface-900 grid grid-cols-12 gap-4 grid-nogutter rounded shadow mb-12" *ngFor="let order of orders">
                <div class="col-span-12 flex p-2 bg-surface-100 dark:bg-surface-700 rounded-t">
                    <div class="p-2 flex-auto text-center md:text-left">
                        <span class="text-surface-700 dark:text-surface-100 block">Order Number</span>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block mt-2">{{ order.orderNumber }}</span>
                    </div>
                    <p-divider align="center" layout="vertical" styleClass="h-full mx-0 lg:mx-4 border-surface-200 dark:border-surface-700"></p-divider>
                    <div class="p-2 flex-auto text-center md:text-left">
                        <span class="text-surface-700 dark:text-surface-100 block">Order Date</span>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block mt-2">{{ order.orderDate }}</span>
                    </div>
                    <p-divider align="center" layout="vertical" styleClass="h-full mx-0 lg:mx-4 border-surface-200 dark:border-surface-700"></p-divider>
                    <div class="p-2 flex-auto text-center md:text-left">
                        <span class="text-surface-700 dark:text-surface-100 block">Total Amount</span>
                        <span class="text-surface-900 dark:text-surface-0 font-medium block mt-2">{{ order.amount }}</span>
                    </div>
                </div>
                <div class="col-span-12">
                    <div class="p-2 my-6 flex flex-col lg:flex-row justify-between items-center" *ngFor="let product of order.products; let i = index">
                        <div class="flex flex-col lg:flex-row justify-center items-center px-2">
                            <img [src]="product.image" alt="product" class="w-32 h-32 mr-4 flex-shrink-0" />
                            <div class="flex flex-col my-auto text-center md:text-left">
                                <span class="text-surface-900 dark:text-surface-0 font-medium mb-4 mt-4 lg:mt-0">{{ product.name }}</span>
                                <span class="text-surface-700 dark:text-surface-100 text-sm mb-4">{{ product.color }} | {{ product.size }}</span>
                                <a pRipple tabindex="0" class="p-2 select-none cursor-pointer w-40 mx-auto lg:mx-0 rounded font-medium text-center border border-primary text-primary duration-150"
                                    >Buy Again <span class="font-light">| {{ product.price }}</span></a
                                >
                            </div>
                        </div>
                        <div class="mr-0 lg:mr-4 mt-6 lg:mt-0 p-2 flex items-center" style="background-color: rgba(76, 175, 80,.1);" [style.border-radius]="'2.5rem'">
                            <span class="bg-green-500 text-white flex items-center justify-center rounded-full mr-2" style="min-width:2rem; min-height: 2rem">
                                <i class="pi pi-check"></i>
                            </span>
                            <span class="text-green-500">{{ product.deliveryDate }}</span>
                        </div>
                        <p-divider *ngIf="i !== order.products.length - 1" class="w-full !block lg:!hidden border-surface-200 dark:border-surface-700"></p-divider>
                    </div>
                </div>
                <div class="col-span-12 p-0 flex border-t border-surface-200 dark:border-surface-700">
                    <a
                        tabindex="0"
                        class="cursor-pointer py-6 flex flex-col md:flex-row text-center justify-center items-center text-primary hover:bg-primary hover:text-primary-contrast dark:hover:text-surface-900 duration-150 w-full"
                        style="border-bottom-left-radius: 6px;"
                        ><i class="pi pi-folder mr-2 mb-2 md:mb-1"></i>Archive Order</a
                    >
                    <a tabindex="0" class="cursor-pointer py-6 flex flex-col md:flex-row text-center justify-center items-center text-primary hover:bg-primary hover:text-primary-contrast dark:hover:text-surface-900 duration-150 w-full">
                        <i class="pi pi-refresh mr-2 mb-2 md:mb-1"></i>Return</a
                    >
                    <a tabindex="0" class="cursor-pointer py-6 flex flex-col md:flex-row text-center justify-center items-center text-primary hover:bg-primary hover:text-primary-contrast dark:hover:text-surface-900 duration-150 w-full">
                        <i class="pi pi-file mr-2 mb-2 md:mb-1"></i>View Invoice</a
                    >
                    <a
                        tabindex="0"
                        class="cursor-pointer py-6 flex flex-col md:flex-row text-center justify-center items-center text-primary hover:bg-primary hover:text-primary-contrast dark:hover:text-surface-900 duration-150 w-full"
                        style="border-bottom-right-radius: 6px;"
                        ><i class="pi pi-comment mr-2 mb-2 md:mb-1"></i>Write a Review</a
                    >
                </div>
            </div>
        </div>
    `
})
export class OrderHistory {
    orders = [
        {
            orderNumber: '45123',
            orderDate: '7 February 2023',
            amount: '$123.00',
            products: [
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$50',
                    deliveryDate: 'Delivered on 7 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-1.png'
                },
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$50',
                    deliveryDate: 'Delivered on 7 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-2.png'
                },
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$63',
                    deliveryDate: 'Delivered on 7 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-3.png'
                }
            ]
        },
        {
            orderNumber: '45126',
            orderDate: '9 February 2023',
            amount: '$250.00',
            products: [
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$80',
                    deliveryDate: 'Delivered on 9 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-4.png'
                },
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$20',
                    deliveryDate: 'Delivered on 9 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-5.png'
                },
                {
                    name: 'Product Name Placeholder A Little Bit Long One',
                    color: 'White',
                    size: 'Small',
                    price: '$150',
                    deliveryDate: 'Delivered on 9 February 2023',
                    image: '/demo/images/ecommerce/order-history/orderhistory-6.png'
                }
            ]
        }
    ];
}
