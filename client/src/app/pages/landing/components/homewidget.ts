import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'home-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, ButtonModule],
    template: `
        <div
            id="home"
            class="grid grid-cols-12 gap-4 grid-nogutter justify-between items-center mb-12 py-12 md:mb-20 md:py-20"
        >
            <div
                class="col-span-12 md:col-span-4 flex flex-col gap-6 order-1 md:order-none items-center md:items-start text-center md:text-left"
            >
                <span
                    class="block text-surface-900 dark:text-surface-0 font-bold text-4xl"
                    >Modern, stylish and clean</span
                >
                <span
                    class="block text-surface-700 dark:text-surface-100 text-lg"
                    >The ultimate collection of design-agnostic, flexible and
                    accessible UI Components.</span
                >
                <ul class="flex flex-wrap gap-8 list-none p-0">
                    <li class="flex items-center">
                        <div
                            class="p-1 rounded-full bg-green-400 inline-block mr-2"
                        ></div>
                        <span
                            class="text-surface-900 dark:text-surface-0 font-semibold"
                            >Javascript</span
                        >
                    </li>
                    <li class="flex items-center">
                        <div
                            class="p-1 rounded-full bg-green-400 inline-block mr-2"
                        ></div>
                        <span
                            class="text-surface-900 dark:text-surface-0 font-semibold"
                            >TypeScript</span
                        >
                    </li>
                    <li class="flex items-center">
                        <div
                            class="p-1 rounded-full bg-green-400 inline-block mr-2"
                        ></div>
                        <span
                            class="text-surface-900 dark:text-surface-0 font-semibold"
                            >Vue</span
                        >
                    </li>
                </ul>
                <button
                    pButton
                    pRipple
                    type="button"
                    label="Live Preview"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="w-48"
                    outlined
                ></button>
            </div>

            <div
                class="col-span-12 md:col-span-7 order-none md:order-1 mb-12 md:mb-0 rounded"
            >
                <img
                    animateEnter="moveinright"
                    src="/demo/images/landing/{{
                        darkMode ? 'dashboard-dark' : 'dashboard-light'
                    }}.png"
                    alt=""
                    class="w-full h-full rounded shadow animate-duration-1000 animate-fadeinright"
                />
            </div>
        </div>
    `,
})
export class HomeWidget {
    subscription: Subscription;

    darkMode: boolean = false;

    constructor(
        public router: Router,
        private layoutService: LayoutService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim'
                        ? true
                        : false;
            },
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
