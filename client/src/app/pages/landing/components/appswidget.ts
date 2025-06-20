import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    selector: 'apps-widget',
    standalone: true,
    imports: [ButtonModule, RippleModule, ButtonModule],
    template: `
        <div id="apps" class="my-12 md:my-20">
        <span class="text-surface-900 dark:text-surface-0 block font-bold text-5xl mb-6 text-center">Apps</span>
        <span class="text-surface-700 dark:text-surface-100 block text-xl mb-20 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</span>

        <div class="flex flex-col lg:flex-row items-center justify-between mt-20 gap-20">
        <div class="flex flex-col items-center">
                    <img
                        animateEnter="scalein"
                        src="/demo/images/landing/{{
                            darkMode ? 'chat-dark' : 'chat-light'
                        }}.png"
                        alt="chat"
                       class="w-full h-full rounded border-surface-200 dark:border-surface-700 shadow animate-duration-500 animate-scalein origin-top"
                    />
                    <span class="block text-surface-900 dark:text-surface-0 text-lg font-semibold mt-6">Chat</span>
                </div>
                <div class="flex flex-col items-center">
                    <img
                        animateEnter="scalein"
                        src="/demo/images/landing/{{
                            darkMode ? 'mail-dark' : 'mail-light'
                        }}.png"
                        alt="chat"
                       class="w-full h-full rounded border-surface-200 dark:border-surface-700 shadow animate-duration-500 animate-scalein origin-top"
                    />
                    <span class="block text-surface-900 dark:text-surface-0 text-lg font-semibold mt-6">Mail</span>
                </div>
            </div>
        </div>
    `,
})
export class AppsWidget {
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
