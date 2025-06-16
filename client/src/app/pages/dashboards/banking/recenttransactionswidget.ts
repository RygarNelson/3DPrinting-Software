import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-recent-transactions-widget',
    imports: [],
    template: `
        <div class="card">
            <div
                class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4"
            >
                Recent Transactions
            </div>
            <ul class="list-none p-0 m-0">
                <li
                    class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700"
                >
                    <img
                        alt="brands"
                        src="/demo/images/banking/airbnb.png"
                        class="w-12 flex-shrink-0 mr-4"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-1"
                            >Airbnb</span
                        >
                        <span>05/23/2022</span>
                    </div>
                    <span
                        class="text-xl text-surface-900 dark:text-surface-0 ml-auto font-semibold"
                        >$250.00</span
                    >
                </li>
                <li
                    class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700"
                >
                    <img
                        alt="brands"
                        src="/demo/images/banking/amazon.png"
                        class="w-12 flex-shrink-0 mr-4"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-1"
                            >Amazon</span
                        >
                        <span>04/12/2022</span>
                    </div>
                    <span
                        class="text-xl text-surface-900 dark:text-surface-0 ml-auto font-semibold"
                        >$50.00</span
                    >
                </li>
                <li
                    class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700"
                >
                    <img
                        alt="brands"
                        src="/demo/images/banking/nike.svg"
                        class="w-12 flex-shrink-0 mr-4 rounded-full"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-1"
                            >Nike Store</span
                        >
                        <span>04/29/2022</span>
                    </div>
                    <span
                        class="text-xl text-surface-900 dark:text-surface-0 ml-auto font-semibold"
                        >$60.00</span
                    >
                </li>
                <li
                    class="flex items-center p-4 mb-4 border-b border-surface-200 dark:border-surface-700"
                >
                    <img
                        alt="brands"
                        src="/demo/images/banking/starbucks.svg"
                        class="w-12 flex-shrink-0 mr-4"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-1"
                            >Starbucks</span
                        >
                        <span>04/15/2022</span>
                    </div>
                    <span
                        class="text-xl text-surface-900 dark:text-surface-0 ml-auto font-semibold"
                        >$15.24</span
                    >
                </li>
                <li class="flex items-center p-4 mb-4">
                    <img
                        alt="brands"
                        src="/demo/images/banking/amazon.png"
                        class="w-12 flex-shrink-0 mr-4"
                    />
                    <div class="flex flex-col">
                        <span
                            class="text-xl font-medium text-surface-900 dark:text-surface-0 mb-1"
                            >Amazon</span
                        >
                        <span>04/12/2022</span>
                    </div>
                    <span
                        class="text-xl text-surface-900 dark:text-surface-0 ml-auto font-semibold"
                        >$12.50</span
                    >
                </li>
            </ul>
        </div>
    `,
})
export class RecentTransactionsWidget {}
