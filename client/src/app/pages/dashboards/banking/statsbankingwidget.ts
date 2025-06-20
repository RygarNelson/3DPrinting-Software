import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-stats-banking-widget',
    imports: [],
    template: `
        <div class="col-span-12 md:col-span-6 xl:col-span-4">
            <div class="card h-full relative overflow-hidden">
                <svg id="visual" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" class="absolute left-0 top-0 h-full w-full" preserveAspectRatio="none">
                    <rect x="0" y="0" width="900" height="600" fill="var(--p-primary-600)"></rect>
                    <path
                        d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
                        fill="var(--p-primary-500)"
                        strokeLinecap="round"
                        strokeLinejoin="miter"
                    ></path>
                </svg>
                <div class="z-20 relative text-white">
                    <div class="text-xl font-semibold mb-4">Debit Card</div>
                    <div class="mb-1 font-semibold">Balance</div>
                    <div class="text-2xl mb-8 font-bold">$2.000,00</div>
                    <div class="flex items-center justify-between">
                        <span class="text-lg">**** **** **** 1412</span>
                        <span class="font-medium text-lg">12/26</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 xl:col-span-4">
            <div class="card h-full">
                <div class="flex items-center justify-between mb-4">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold">Credit Card</div>
                    <img alt="avatar" src="/demo/images/banking/visa.svg" class="h-4" />
                </div>
                <div class="text-surface-600 dark:text-surface-200 mb-1 font-semibold">Debt</div>
                <div class="text-2xl text-primary mb-8 font-bold">$1.500,00</div>
                <div class="flex items-center justify-between">
                    <span class="text-surface-900 dark:text-surface-0 text-lg">**** **** **** 1231</span>
                    <span class="text-surface-600 dark:text-surface-200 font-medium text-lg">12/24</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 xl:col-span-2">
            <div class="card h-full flex flex-col items-center justify-center">
                <i class="pi pi-dollar text-primary !text-4xl mb-6"></i>
                <span class="text-surface-900 dark:text-surface-0 text-lg mb-6 font-medium">Primary</span>
                <span class="text-2xl text-primary font-bold">$24,345.21</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 xl:col-span-2">
            <div class="card h-full flex flex-col items-center justify-center">
                <i class="pi pi-euro text-primary !text-4xl mb-6"></i>
                <span class="text-surface-900 dark:text-surface-0 text-lg mb-6 font-medium">Currency</span>
                <span class="text-2xl text-primary font-bold">$10,416.11</span>
            </div>
        </div>
    `,
    host: {
        '[style.display]': '"contents"'
    }
})
export class StatsBankingWidget {}
