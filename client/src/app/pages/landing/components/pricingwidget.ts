import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'pricing-widget',
    imports: [ButtonModule],
    template: `
        <div id="pricing" class="my-12 py-12 md:my-20 md:py-20">
            <div
                class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-6 text-center"
            >
                Pricing Plans
            </div>
            <div
                class="text-surface-700 dark:text-surface-100 text-xl mb-20 text-center leading-normal"
            >
                Choose a plan that works best for you and your team.
            </div>
            <div
                class="flex flex-col lg:flex-row gap-4 grid-nogutter justify-center mt-20"
            >
                <div class="w-full lg:w-1/2 xl:w-1/3">
                    <div class="p-4 h-full">
                        <div
                            class="shadow p-12 h-full flex flex-col bg-surface-0 dark:bg-surface-900"
                            style="border-radius: 6px"
                        >
                            <span
                                class="text-surface-900 dark:text-surface-0 block font-medium text-xl mb-2 text-center"
                                >Basic Licence</span
                            >
                            <span
                                class="font-bold block text-2xl text-surface-900 dark:text-surface-0 text-center"
                                >$29</span
                            >

                            <ul class="list-none p-0 m-0 flex-grow-1 mt-12">
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Up to 10 Active Users</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Up to 30 Project Integrations</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Analytics Module</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-times text-red-500 mr-2"
                                    ></i>
                                    <span>Finance Module</span>
                                </li>
                            </ul>

                            <button
                                pButton
                                pRipple
                                label="Choose Plan"
                                class="px-8 w-full mt-12"
                                outlined
                                icon="pi pi-arrow-right"
                                iconPos="right"
                            ></button>
                        </div>
                    </div>
                </div>

                <div class="w-full lg:w-1/2 xl:w-1/3">
                    <div class="p-4 h-full">
                        <div
                            class="shadow p-12 h-full flex flex-col bg-surface-0 dark:bg-surface-900"
                            style="border-radius: 6px"
                        >
                            <span
                                class="text-surface-900 dark:text-surface-0 block font-medium text-xl mb-2 text-center"
                                >Extended Licence</span
                            >
                            <span
                                class="font-bold block text-2xl text-surface-900 dark:text-surface-0 text-center"
                                >$49</span
                            >

                            <ul class="list-none p-0 m-0 flex-grow-1 mt-12">
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Up to 10 Active Users</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Up to 30 Project Integrations</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-check text-green-500 mr-2"
                                    ></i>
                                    <span>Analytics Module</span>
                                </li>
                                <li class="flex items-center mb-4">
                                    <i
                                        class="pi pi-times text-red-500 mr-2"
                                    ></i>
                                    <span>Finance Module</span>
                                </li>
                            </ul>

                            <button
                                pButton
                                pRipple
                                label="Choose Plan"
                                class="px-8 w-full mt-12"
                                outlined
                                icon="pi pi-arrow-right"
                                iconPos="right"
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class PricingWidget {}
