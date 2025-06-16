import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    standalone: true,
    selector: 'app-header-widget',
    imports: [ButtonModule, TooltipModule],
    template: `
        <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="flex flex-col sm:flex-row items-center gap-4">
                <img
                    alt="avatar"
                    src="/demo/images/avatar/circle/avatar-f-1.png"
                    class="w-16 h-16 flex-shrink-0"
                />
                <div class="flex flex-col items-center sm:items-start">
                    <span
                        class="text-surface-900 dark:text-surface-0 font-bold text-4xl"
                        >Welcome Isabel</span
                    >
                    <p class="text-surface-600 dark:text-surface-200 m-0">
                        Your last login was on 04/05/2022 at 10:24 am
                    </p>
                </div>
            </div>
            <div class="flex gap-2 sm:ml-auto">
                <p-button
                    pTooltip="Exchange"
                    tooltipPosition="bottom"
                    icon="pi pi-arrows-h"
                    outlined
                    rounded
                ></p-button>
                <p-button
                    pTooltip="Withdraw"
                    tooltipPosition="bottom"
                    icon="pi pi-download"
                    outlined
                    rounded
                ></p-button>
                <p-button
                    pTooltip="Send"
                    tooltipPosition="bottom"
                    icon="pi pi-send"
                    rounded
                ></p-button>
            </div>
        </div>
    `,
})
export class HeaderWidget {}
