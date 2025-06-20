import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {RippleModule} from 'primeng/ripple';
import {TabsModule} from 'primeng/tabs';

@Component({
    selector: 'app-product-overview',
    imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule, RippleModule, TabsModule],
    template: `
        <div class="card">
            <div class="grid grid-cols-12 gap-4 mb-16">
                <div class="col-span-12 lg:col-span-7">
                    <div class="flex">
                        <div class="flex flex-col w-2/12 justify-between" style="row-gap: 1rem;">
                            <img
                                *ngFor="let image of images; let i = index"
                                [ngClass]="{
                                    'border-primary': selectedImageIndex === i
                                }"
                                src="/demo/images/ecommerce/productoverview/{{ image }}"
                                class="w-full cursor-pointer border-2 border-transparent transition-colors duration-150 border-round"
                                (click)="selectedImageIndex = i"
                            />
                        </div>
                        <div class="pl-4 w-10/12 flex">
                            <img src="/demo/images/ecommerce/productoverview/{{ images[selectedImageIndex] }}" class="w-full border-2 border-transparent rounded" />
                        </div>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-4 py-4 lg:pl-12">
                    <div class="flex items-center text-xl font-medium text-surface-900 dark:text-surface-0 mb-6">Product Title Placeholder</div>
                    <div class="flex flex-wrap items-center justify-between mb-8">
                        <span class="text-surface-900 dark:text-surface-0 font-medium text-3xl block">$120</span>
                        <div class="flex items-center">
                            <span class="mr-4 flex-shrink-0">
                                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                <i class="pi pi-star text-surface-600 dark:text-surface-200 mr-1"></i>
                            </span>
                            <span class="text-sm">
                                <b class="text-surface-900 dark:text-surface-0 mr-1">24</b>
                                <span class="text-surface-500 dark:text-surface-300"></span>reviews
                            </span>
                        </div>
                    </div>

                    <div class="font-bold text-surface-900 dark:text-surface-0 mb-4">Color</div>
                    <div class="flex items-center mb-8">
                        <div
                            class="w-8 h-8 flex-shrink-0 rounded-full bg-slate-500 mr-4 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                            [style.box-shadow]="color === 'bluegray' ? '0 0 0 0.2rem var(--p-gray-500)' : null"
                            (click)="color = 'bluegray'"
                        ></div>
                        <div
                            class="w-8 h-8 flex-shrink-0 rounded-full bg-green-500 mr-4 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                            [style.box-shadow]="color === 'green' ? '0 0 0 0.2rem var(--p-green-500)' : null"
                            (click)="color = 'green'"
                        ></div>
                        <div
                            class="w-8 h-8 flex-shrink-0 rounded-full bg-blue-500 cursor-pointer border-2 border-surface-200 dark:border-surface-700 transition-all duration-300"
                            [style.box-shadow]="color === 'blue' ? '0 0 0 0.2rem var(--p-blue-500)' : null"
                            (click)="color = 'blue'"
                        ></div>
                    </div>

                    <div class="mb-4 flex items-center justify-between">
                        <span class="font-bold text-surface-900 dark:text-surface-0">Size</span>
                        <a tabindex="0" class="cursor-pointer text-surface-600 dark:text-surface-200 text-sm flex items-center"> Size Guide <i class="ml-1 pi pi-angle-right"></i> </a>
                    </div>
                    <div class="flex flex-wrap gap-4 items-center mb-8">
                        <div
                            class="h-12 w-[3rem] border border-surface-300 dark:border-surface-500 text-surface-900 dark:text-surface-0 inline-flex justify-center items-center flex-shrink-0 rounded mr-4 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors"
                            [ngClass]="{
                                '!border-primary border-2 !text-primary': size === 'XS'
                            }"
                            (click)="size = 'XS'"
                        >
                            XS
                        </div>
                        <div
                            class="h-12 w-[3rem] border border-surface-300 dark:border-surface-500 text-surface-900 dark:text-surface-0 inline-flex justify-center items-center flex-shrink-0 rounded mr-4 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors"
                            [ngClass]="{
                                '!border-primary border-2 !text-primary': size === 'S'
                            }"
                            (click)="size = 'S'"
                        >
                            S
                        </div>
                        <div
                            class="h-12 w-[3rem] border border-surface-300 dark:border-surface-500 text-surface-900 dark:text-surface-0 inline-flex justify-center items-center flex-shrink-0 rounded mr-4 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors"
                            [ngClass]="{
                                '!border-primary border-2 !text-primary': size === 'M'
                            }"
                            (click)="size = 'M'"
                        >
                            M
                        </div>
                        <div
                            class="h-12 w-[3rem] border border-surface-300 dark:border-surface-500 text-surface-900 dark:text-surface-0 inline-flex justify-center items-center flex-shrink-0 rounded mr-4 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors"
                            [ngClass]="{
                                '!border-primary border-2 !text-primary': size === 'L'
                            }"
                            (click)="size = 'L'"
                        >
                            L
                        </div>
                        <div
                            class="h-12 w-[3rem] border border-surface-300 dark:border-surface-500 text-surface-900 dark:text-surface-0 inline-flex justify-center items-center flex-shrink-0 rounded cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 duration-150 transition-colors"
                            [ngClass]="{
                                '!border-primary border-2 !text-primary': size === 'XL'
                            }"
                            (click)="size = 'XL'"
                        >
                            XL
                        </div>
                    </div>

                    <div class="font-bold text-surface-900 dark:text-surface-0 mb-4">Quantity</div>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center flex-wrap gap-4">
                        <p-inputNumber
                            [showButtons]="true"
                            buttonLayout="horizontal"
                            [min]="0"
                            inputStyleClass="w-12 text-center py-2 px-1 border-transparent outline-0 shadow-none"
                            styleClass="border border-surface-200 dark:border-surface-700 rounded"
                            [(ngModel)]="quantity"
                            decrementButtonClass="p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1"
                            incrementButtonClass="p-button-text text-surface-600 dark:text-surface-200 hover:text-primary py-1 px-1"
                            incrementButtonIcon="pi pi-plus"
                            decrementButtonIcon="pi pi-minus"
                        ></p-inputNumber>
                        <div class="flex items-center flex-0 lg:flex-1 gap-4">
                            <button pButton pRipple label="Add to Cart" class="flex-shrink-0 w-full"></button>
                            <i
                                class="pi text-2xl cursor-pointer"
                                [ngClass]="{
                                    'pi-heart text-600': !liked,
                                    'pi-heart-fill text-orange-500': liked
                                }"
                                (click)="liked = !liked"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>

            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Details</p-tab>
                    <p-tab value="1">Reviews</p-tab>
                    <p-tab value="2">Shipping and Returns</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-3xl mb-6 mt-2">Product Details</div>
                        <p class="leading-normal text-surface-600 dark:text-surface-200 p-0 mx-0 mt-0 mb-6">
                            Volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Duis ultricies lacus sed turpis tincidunt id. Sed tempus urna et pharetra. Metus vulputate eu scelerisque felis imperdiet proin fermentum.
                            Venenatis urna cursus eget nunc scelerisque viverra mauris in. Viverra justo nec ultrices dui sapien eget mi proin. Laoreet suspendisse interdum consectetur libero id faucibus.
                        </p>

                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 lg:col-span-4">
                                <span class="text-surface-900 dark:text-surface-0 block mb-4 font-bold">Highlights</span>
                                <ul class="py-0 pl-4 m-0 text-surface-600 dark:text-surface-200 mb-4">
                                    <li class="mb-2">Vulputate sapien nec.</li>
                                    <li class="mb-2">Purus gravida quis blandit.</li>
                                    <li class="mb-2">Nisi quis eleifend quam adipiscing.</li>
                                    <li>Imperdiet proin fermentum.</li>
                                </ul>
                            </div>
                            <div class="col-span-12 lg:col-span-4">
                                <span class="text-surface-900 dark:text-surface-0 block mb-4 font-bold">Size and Fit</span>
                                <ul class="list-none p-0 m-0 text-surface-600 dark:text-surface-200 mb-6">
                                    <li class="mb-4">
                                        <span class="font-semibold">Leo vel:</span>
                                        Egestas congue.
                                    </li>
                                    <li class="mb-4">
                                        <span class="font-semibold">Sociis natoque:</span>
                                        Parturient montes nascetur.
                                    </li>
                                    <li>
                                        <span class="font-semibold">Suspendisse in:</span>
                                        Purus sit amet volutpat.
                                    </li>
                                </ul>
                            </div>
                            <div class="col-span-12 lg:col-span-4">
                                <span class="text-surface-900 dark:text-surface-0 block mb-4 font-bold">Material & Care</span>
                                <ul class="p-0 m-0 flex flex-wrap flex-col xl:flex-row text-surface-600 dark:text-surface-200">
                                    <li class="flex items-center whitespace-nowrap w-40 mr-2 mb-4">
                                        <i class="pi pi-sun mr-2 text-surface-900 dark:text-surface-0"></i>
                                        <span>Not dryer safe</span>
                                    </li>
                                    <li class="flex items-center whitespace-nowrap w-40 mb-4">
                                        <i class="pi pi-times-circle mr-2 text-surface-900 dark:text-surface-0"></i>
                                        <span>No chemical wash</span>
                                    </li>
                                    <li class="flex items-center whitespace-nowrap w-40 mb-4 mr-2">
                                        <i class="pi pi-sliders-h mr-2 text-surface-900 dark:text-surface-0"></i>
                                        <span>Iron medium heat</span>
                                    </li>
                                    <li class="flex items-center whitespace-nowrap w-40 mb-4">
                                        <i class="pi pi-minus-circle mr-2 text-surface-900 dark:text-surface-0"></i>
                                        <span>Dry flat</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-3xl mb-6 mt-2">Customer Reviews</div>
                        <ul class="list-none p-0 m-0">
                            <li class="pb-8 border-b border-surface-200 dark:border-surface-700">
                                <span>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-gray-500"></i>
                                </span>
                                <div class="text-surface-900 dark:text-surface-0 font-bold text-xl my-4">Absolute Perfection!</div>
                                <p class="mx-0 mt-0 mb-4 text-surface-600 dark:text-surface-200 leading-normal">
                                    Blandit libero volutpat sed cras ornare arcu dui vivamus. Arcu dictum varius duis at consectetur lorem donec massa. Imperdiet proin fermentum leo vel orci porta non. Porttitor rhoncus dolor purus non.
                                </p>
                                <span class="font-medium">Darlene Robertson, 2 days ago</span>
                            </li>
                            <li class="py-8 border-b border-surface-200 dark:border-surface-700">
                                <span>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </span>
                                <div class="text-surface-900 dark:text-surface-0 font-bold text-xl my-4">Classy</div>
                                <p class="mx-0 mt-0 mb-4 text-surface-600 dark:text-surface-200 leading-normal">Venenatis cras sed felis eget. Proin nibh nisl condimentum id venenatis a condimentum.</p>
                                <span class="font-medium">Kristin Watson, 2 days ago</span>
                            </li>
                        </ul>
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <div class="text-surface-900 dark:text-surface-0 font-bold text-3xl mb-6 mt-2">Shipping Placeholder</div>
                        <p class="leading-normal text-surface-600 dark:text-surface-200 p-0 mx-0 mt-0 mb-6">
                            Mattis aliquam faucibus purus in massa tempor nec feugiat nisl. Justo donec enim diam vulputate ut pharetra. Tempus egestas sed sed risus. Feugiat sed lectus vestibulum mattis. Tristique nulla aliquet enim tortor at auctor
                            urna nunc. Habitant morbi tristique senectus et. Facilisi nullam vehicula ipsum.
                        </p>

                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6">
                                <span class="text-surface-900 dark:text-surface-0 block font-bold mb-4">Shipping Costs</span>
                                <ul class="py-0 pl-4 m-0 text-surface-600 dark:text-surface-200 mb-4">
                                    <li class="mb-2">Japan - JPY 2,500.</li>
                                    <li class="mb-2">Europe - EUR 10</li>
                                    <li class="mb-2">Switzerland - CHF 10</li>
                                    <li class="mb-2">Canada - CAD 25</li>
                                    <li class="mb-2">USA - USD 20</li>
                                    <li class="mb-2">Australia - AUD 30</li>
                                    <li class="mb-2">United Kingdom - GBP 10</li>
                                </ul>
                            </div>
                            <div class="col-span-12 md:col-span-6">
                                <span class="text-surface-900 dark:text-surface-0 block font-bold mb-4">Return Policy</span>
                                <p class="leading-normal text-surface-600 dark:text-surface-200 p-0 m-0">Pharetra et ultrices neque ornare aenean euismod elementum nisi. Diam phasellus vestibulum lorem sed. Mattis molestie a iaculis at.</p>
                            </div>
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `
})
export class ProductOverview {
    color: string = 'bluegray';

    size: string = 'M';

    liked: boolean = false;

    images: string[] = [];

    selectedImageIndex: number = 0;

    quantity: number = 1;

    ngOnInit(): void {
        this.images = ['product-overview-3-1.png', 'product-overview-3-2.png', 'product-overview-3-3.png', 'product-overview-3-4.png'];
    }
}
