import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-help',
    standalone: true,
    imports: [IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <div>
            <div class="card">
                <div
                    class="relative overflow-hidden h-80 bg-primary text-primary-contrast flex flex-col items-center justify-center rounded mb-20"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        class="absolute w-full top-0 left-0"
                    >
                        <path
                            fill="var(--p-primary-600)"
                            fill-opacity="1"
                            d="M0,64L48,90.7C96,117,192,171,288,208C384,245,480,267,576,256C672,245,768,203,864,165.3C960,128,1056,96,1152,74.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                        ></path>
                    </svg>
                    <div class="font-bold mb-8 text-4xl z-10">
                        How can we help?
                    </div>

                    <p-iconfield class="w-9/12 md:w-6/12">
                        <p-inputicon class="pi pi-search" />
                        <input
                            type="text"
                            pInputText
                            placeholder="Search"
                            style="border-radius:2rem"
                            class="w-full "
                            [style]="{ borderRadius: '2rem' }"
                        />
                    </p-iconfield>
                </div>

                <div class="grid grid-cols-12 gap-4 mb-8">
                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-power-off text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">
                                Getting Started
                            </div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-arrows-h text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">
                                Transactions
                            </div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-user text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">Profile</div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-money-bill text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">Billing</div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-database text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">
                                Integrations
                            </div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-8">
                        <div class="flex flex-col items-center">
                            <span
                                class="inline-flex items-center justify-center rounded-full w-20 h-20 bg-primary-100 mb-8"
                            >
                                <i
                                    class="pi pi-lock text-4xl text-primary-700"
                                ></i>
                            </span>
                            <div class="text-2xl mb-4 font-medium">
                                Security
                            </div>
                            <ul class="list-none m-0 p-0 text-center">
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Lorem ipsum dolor</a
                                    >
                                </li>
                                <li class="leading-normal mb-1">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Consectetur adipiscing elit</a
                                    >
                                </li>
                                <li class="leading-normal mb-4">
                                    <a
                                        class="text-surface-500 dark:text-surface-400 hover:text-primary cursor-pointer"
                                        >Sed do eiusmod tempor</a
                                    >
                                </li>
                                <li>
                                    <a
                                        class="text-primary hover:underline cursor-pointer font-medium"
                                        >View all</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class Help {}
