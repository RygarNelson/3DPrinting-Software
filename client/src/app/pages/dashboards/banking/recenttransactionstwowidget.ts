import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    standalone: true,
    selector: 'app-recent-transactions-two-widget',
    imports: [FormsModule, InputNumberModule, ButtonModule],
    template: `
        <div class="card h-full">
            <div class="flex items-center justify-between mb-4">
                <div
                    class="text-surface-900 dark:text-surface-0 text-xl font-semibold"
                >
                    Recent Transactions
                </div>
                <p-button
                    type="button"
                    icon="pi pi-plus"
                    label="Add New"
                    size="small"
                    outlined
                ></p-button>
            </div>
            <div class="flex flex-col gap-y-4">
                <div class="flex flex-col lg:flex-row gap-4">
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer border-radius"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-f-1.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Aisha Williams</span
                        >
                    </div>
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer border-radius"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-f-2.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Jane Watson</span
                        >
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row gap-4">
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer border-radius"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-m-1.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Brad Curry</span
                        >
                    </div>
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer border-radius"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-f-3.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Claire Dunphy</span
                        >
                    </div>
                </div>
                <div class="flex flex-col lg:flex-row gap-4">
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer border-radius"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-m-2.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Kevin James</span
                        >
                    </div>
                    <div
                        class="w-full lg:w-6/12 p-4 border rounded border-surface-200 dark:border-surface-700 flex items-center hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer"
                    >
                        <img
                            alt="avatar"
                            src="/demo/images/avatar/circle/avatar-f-4.png"
                            class="w-8 flex-shrink-0 mr-2"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 text-lg font-medium"
                            >Sarah McTamish</span
                        >
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mt-8">
                <p-inputnumber
                    type="text"
                    [(ngModel)]="price"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    fluid
                ></p-inputnumber>
                <p-button type="button" label="Send"></p-button>
            </div>
        </div>
    `,
})
export class RecentTransactionsTwoWidget {
    price: number = 0;
}
