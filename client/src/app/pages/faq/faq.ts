import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-faq',
    imports: [AccordionModule, CommonModule, RippleModule],
    template: `
        <div>
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 font-bold text-xl mb-4">Frequently Asked Questions</div>
                <p class="text-surface-600 dark:text-surface-200 leading-normal">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <div class="card mb-0 md:w-80">
                    <div class="text-surface-900 dark:text-surface-0 block font-bold mb-4">Categories</div>
                    <ul class="list-none m-0 p-0">
                        <li pRipple *ngFor="let item of items; let i = index" (click)="changeItem(i)" class="mb-2 ">
                            <a
                                class="flex items-center cursor-pointer select-none p-4 transition-colors duration-150 rounded-border"
                                [ngClass]="{
                                    'bg-primary text-primary-contrast': activeIndex === i,
                                    'hover:bg-surface-100 dark:hover:bg-surface-800': activeIndex !== i
                                }"
                            >
                                <i [class]="item.icon" class="mr-2 text-lg"></i>
                                <span>{{ item.label }}</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="card flex-1">
                    <p-accordion>
                        @for (question of items[activeIndex].questions; track question; let i = $index) {
                            <p-accordion-panel [value]="items[i].value">
                                <p-accordion-header>{{ question }}</p-accordion-header>
                                <p-accordion-content>
                                    <p class="leading-normal m-0 p-0">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                                        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                                        mollit anim id est laborum.
                                    </p>
                                </p-accordion-content>
                            </p-accordion-panel>
                        }
                    </p-accordion>
                </div>
            </div>
        </div>
    `
})
export class Faq implements OnInit {
    items: any[] = [];

    activeIndex: number = 0;

    constructor() {}

    ngOnInit(): void {
        this.items = [
            {
                label: 'General',
                icon: 'pi pi-fw pi-info-circle',
                questions: ['Is there a trial period?', 'Do I need to sign up with credit card?', 'Is the subscription monthly or annual?', 'How many tiers are there?'],
                value: '0'
            },
            {
                label: 'Mailing',
                icon: 'pi pi-fw pi-envelope',
                questions: ['How do I setup my account?', 'Is there a limit on mails to send?', 'What is my inbox size?', 'How can I add attachements?'],
                value: '1'
            },
            {
                label: 'Support',
                icon: 'pi pi-fw pi-question-circle',
                questions: ['How can I get support?', 'What is the response time?', 'Is there a community forum?', 'Is live chat available?'],
                value: '2'
            },
            {
                label: 'Billing',
                icon: 'pi pi-fw pi-credit-card',
                questions: ['Will I receive an invoice?', 'How to provide my billing information?', 'Is VAT included?', 'Can I receive PDF invoices?'],
                value: '3'
            }
        ];
    }

    changeItem(i: number) {
        this.activeIndex = i;
    }
}
