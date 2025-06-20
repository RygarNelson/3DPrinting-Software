import {Component, OnDestroy} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {Mail} from '@/types/mail';
import {MailService} from './service/mail.service';
import {filter, Subscription} from 'rxjs';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-mail-sidebar',
    standalone: true,
    imports: [ButtonModule, RippleModule, RouterModule, CommonModule],
    template: `<div>
        <button pButton pRipple label="Compose New" class="mb-8 w-full" outlined [routerLink]="'/apps/mail/compose/'"></button>
        <div class="overflow-auto">
            <ul class="flex flex-row md:flex-col gap-1 md:gap-2 list-none m-0 p-0 overflow-auto">
                <li
                    [routerLinkActive]="'bg-primary'"
                    [routerLink]="item?.routerLink"
                    pRipple
                    *ngFor="let item of items; let i = index"
                    class="cursor-pointer select-none p-4 duration-150 rounded flex items-center justify-center md:justify-start md:flex-1 flex-auto"
                    [ngClass]="{
                        'bg-primary': url === item.routerLink,
                        'hover:surface-hover': url !== item.routerLink
                    }"
                >
                    <i
                        [class]="item.icon || ''"
                        class="md:mr-4 text-surface-600 dark:text-surface-200 duration-150 text-lg"
                        [ngClass]="{
                            'text-white dark:text-surface-900': url === item.routerLink
                        }"
                    ></i>
                    <span
                        class="text-surface-900 dark:text-surface-0 font-medium hidden md:inline"
                        [ngClass]="{
                            'text-white dark:text-surface-900': url === item.routerLink
                        }"
                        >{{ item.label }}</span
                    >
                    <span
                        *ngIf="item.badge"
                        [ngClass]="{
                            'dark:bg-primary-900 dark:text-white': url === item.routerLink
                        }"
                        class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline-flex items-center justify-center"
                        style="border-radius: 50%; min-width: 23px; height: auto; aspect-ratio: 1; padding: 0 6px;"
                    >
                        {{ item.badge }}
                    </span>
                </li>
            </ul>
        </div>
    </div>`
})
export class MailSidebarComponent implements OnDestroy {
    items: MenuItem[] = [];

    badgeValues: any;

    mailSubscription: Subscription;

    routeSubscription: Subscription;

    url: string = '';

    constructor(
        private router: Router,
        private mailService: MailService
    ) {
        this.url = this.router.url;
        this.mailSubscription = this.mailService.mails$.subscribe((data) => this.getBadgeValues(data));

        this.routeSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params: any) => {
            this.url = params.url;
        });
    }

    getBadgeValues(data: Mail[]) {
        let inbox = [],
            starred = [],
            spam = [],
            important = [],
            archived = [],
            trash = [],
            sent = [];

        for (let i = 0; i < data.length; i++) {
            let mail = data[i];

            if (!mail.archived && !mail.trash && !mail.spam && !mail.hasOwnProperty('sent')) {
                inbox.push(mail);
            }
            if (mail.starred && !mail.archived && !mail.trash) {
                starred.push(mail);
            }
            if (mail.spam && !mail.archived && !mail.trash) {
                spam.push(mail);
            }
            if (mail.important && !mail.archived && !mail.trash) {
                important.push(mail);
            }
            if (mail.archived && !mail.trash) {
                archived.push(mail);
            }
            if (mail.trash) {
                trash.push(mail);
            }
            if (mail.sent && !mail.archived && !mail.trash) {
                sent.push(mail);
            }
        }

        this.badgeValues = {
            inbox: inbox.length,
            starred: starred.length,
            spam: spam.length,
            important: important.length,
            archived: archived.length,
            trash: trash.length,
            sent: sent.length
        };

        this.updateSidebar();
    }

    updateSidebar() {
        this.items = [
            {
                label: 'Inbox',
                icon: 'pi pi-inbox',
                badge: this.badgeValues.inbox,
                routerLink: '/apps/mail/inbox'
            },
            {
                label: 'Starred',
                icon: 'pi pi-star',
                badge: this.badgeValues.starred,
                routerLink: '/apps/mail/starred'
            },
            {
                label: 'Spam',
                icon: 'pi pi-ban',
                badge: this.badgeValues.spam,
                routerLink: '/apps/mail/spam'
            },
            {
                label: 'Important',
                icon: 'pi pi-bookmark',
                badge: this.badgeValues.important,
                routerLink: '/apps/mail/important'
            },
            {
                label: 'Sent',
                icon: 'pi pi-send',
                badge: this.badgeValues.sent,
                routerLink: '/apps/mail/sent'
            },
            {
                label: 'Archived',
                icon: 'pi pi-book',
                badge: this.badgeValues.archived,
                routerLink: '/apps/mail/archived'
            },
            {
                label: 'Trash',
                icon: 'pi pi-trash',
                badge: this.badgeValues.trash,
                routerLink: '/apps/mail/trash'
            }
        ];
    }

    ngOnDestroy() {
        this.mailSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }
}
