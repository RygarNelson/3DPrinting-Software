import { Component } from '@angular/core';

@Component({
    selector: 'app-invoice',
    standalone: true,
    template: `
        <div class="card py-20 px-12 md:px-20 overflow-auto">
            <div
                class="flex flex-col items-start md:flex-row md:items-center md:justify-between border-b border-surface-200 dark:border-surface-700 pb-8 min-w-max"
            >
                <div class="flex flex-col">
                    <svg
                        width="48"
                        height="50"
                        viewBox="0 0 48 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M33.1548 9.65956L23.9913 4.86169L5.54723 14.5106L0.924465 12.0851L23.9913 0L37.801 7.23403L33.1548 9.65956ZM23.9931 19.3085L42.4255 9.65955L47.0717 12.0851L23.9931 24.1595L10.1952 16.9361L14.8297 14.5106L23.9931 19.3085ZM4.6345 25.8937L0 23.4681V37.9149L23.0669 50V45.1489L4.6345 35.4894V25.8937ZM18.4324 28.2658L0 18.6169V13.7658L23.0669 25.8403V40.2977L18.4324 37.8615V28.2658ZM38.7301 23.468V18.6169L24.9205 25.8403V49.9999L29.555 47.5743V28.2659L38.7301 23.468ZM43.3546 35.4892V16.1914L48.0008 13.7659V37.9148L34.1912 45.1488V40.2977L43.3546 35.4892Z"
                            fill="var(--p-primary-color)"
                        />
                    </svg>
                    <div
                        class="my-4 text-4xl font-bold text-surface-900 dark:text-surface-0"
                    >
                        YOUR COMPANY
                    </div>
                    <span class="mb-2">9137 3rd Lane California City</span>
                    <span>CA 93504, U.S.A.</span>
                </div>
                <div class="flex flex-col mt-8 md:mt-0">
                    <div
                        class="text-2xl font-semibold text-left md:text-right mb-4"
                    >
                        INVOICE
                    </div>
                    <div class="flex flex-col">
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold mr-12">DATE</span>
                            <span>30/08/2019</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="font-semibold mr-12">INVOICE #</span>
                            <span>8523</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="font-semibold mr-12">CUSTOMER ID</span>
                            <span>C1613</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 mb-20 flex flex-col">
                <div class="mb-4 text-2xl font-medium">BILL TO</div>
                <span class="mb-2">Claire Williams, 148 Hope Lane</span>
                <span>Palo Alto, CA 94304.</span>
            </div>
            <div class="overflow-x-auto">
                <table
                    class="w-full"
                    style="border-collapse: collapse; table-layout: auto"
                >
                    <thead>
                        <tr>
                            <th
                                class="text-left font-semibold py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap"
                            >
                                Description
                            </th>
                            <th
                                class="text-right font-semibold py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap px-4"
                            >
                                Quantity
                            </th>
                            <th
                                class="text-right font-semibold py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap px-4"
                            >
                                Unit Price
                            </th>
                            <th
                                class="text-right font-semibold py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap"
                            >
                                Line Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                class="text-left py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap"
                            >
                                Green T-Shirt
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                1
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                $49.00
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700"
                            >
                                $49.00
                            </td>
                        </tr>
                        <tr>
                            <td
                                class="text-left py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap"
                            >
                                Game Controller
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                2
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                $99.00
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700"
                            >
                                $198.00
                            </td>
                        </tr>
                        <tr>
                            <td
                                class="text-left py-4 border-b border-surface-200 dark:border-surface-700 whitespace-nowrap"
                            >
                                Mini Speakers
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                1
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700 px-4"
                            >
                                $85.00
                            </td>
                            <td
                                class="text-right py-4 border-b border-surface-200 dark:border-surface-700"
                            >
                                $85.00
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="flex flex-col md:flex-row md:items-start md:justify-between mt-20"
            >
                <div class="font-semibold mb-4 md:mb-0">NOTES</div>
                <div class="flex flex-col">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold mr-12">SUBTOTAL</span>
                        <span>$332.00</span>
                    </div>
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-semibold mr-12">VAT #</span>
                        <span>0</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold mr-12">TOTAL</span>
                        <span>$332.00</span>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Invoice {}
