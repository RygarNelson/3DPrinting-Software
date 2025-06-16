import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { MailReplyComponent } from './mail-reply';
import { MailService } from './service/mail.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { Mail } from '@/types/mail';

@Component({
    selector: 'app-mail-table',
    standalone: true,
    imports: [TableModule, ButtonModule, CommonModule, DialogModule, RippleModule, AvatarModule, MenuModule, MailReplyComponent, IconFieldModule, InputIconModule, InputTextModule, TooltipModule],
    template: `<p-table
            #dt
            [value]="mails"
            responsiveLayout="scroll"
            [rows]="10"
            [globalFilterFields]="['from', 'title', 'message']"
            [paginator]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            [(selection)]="selectedMails"
            selectionMode="multiple"
            [rowHover]="true"
            dataKey="id"
        >
            <ng-template #caption>
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex gap-2 items-center">
                        <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
                        <button pButton pRipple type="button" icon="pi pi-refresh" rounded text plain class="ml-4"></button>
                        <button pButton pRipple type="button" icon="pi pi-ellipsis-v" class="ml-3" rounded text plain (click)="menu.toggle($event)"></button>
                        <p-menu #menu [model]="menuItems" [appendTo]="dt" [popup]="true"></p-menu>
                    </div>
                    <p-iconfield>
                        <p-inputicon class="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search Mail" class="w-full sm:w-auto" />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #body let-mail>
                <tr (mouseenter)="toggleOptions($event, options, date)" (mouseleave)="toggleOptions($event, options, date)" (click)="onRowSelect(mail.id)" class="cursor-pointer">
                    <td style="width: 4rem" class="pl-3">
                        <p-tableCheckbox [value]="mail" (click)="$event.stopPropagation()" (touchend)="$event.stopPropagation()"></p-tableCheckbox>
                    </td>
                    <td *ngIf="!mail.trash && !mail.spam" style="width: 4rem">
                        <span (click)="onStar($event, mail.id)" (touchend)="onStar($event, mail.id)" class="cursor-pointer">
                            <i
                                class="pi pi-fw text-xl"
                                [ngClass]="{
                                    'pi-star-fill': mail.starred,
                                    'pi-star': !mail.starred
                                }"
                            ></i>
                        </span>
                    </td>
                    <td *ngIf="!mail.trash && !mail.spam" style="width: 4rem">
                        <span (click)="onBookmark($event, mail.id)" (touchend)="onBookmark($event, mail.id)" class="cursor-pointer">
                            <i
                                class="pi pi-fw text-xl"
                                [ngClass]="{
                                    'pi-bookmark-fill': mail.important,
                                    'pi-bookmark': !mail.important
                                }"
                            ></i>
                        </span>
                    </td>
                    <td style="min-width: 4rem">
                        <p-avatar [image]="mail.image ? '/demo/images/avatar/' + mail.image : 'assets/layout/images/avatar.png'"></p-avatar>
                    </td>
                    <td style="min-width: 12rem" class="text-900 font-semibold">
                        {{ mail.from || mail.to }}
                    </td>
                    <td style="min-width: 12rem">
                        <span class="font-medium white-space-nowrap overflow-hidden text-overflow-ellipsis block" style="max-width: 30rem">
                            {{ mail.title }}
                        </span>
                    </td>
                    <td style="width: 12rem;">
                        <div class="flex justify-content-end w-full px-0">
                            <span #date class="text-700 font-semibold white-space-nowrap">
                                {{ mail.date }}
                            </span>
                            <div style="display: none" #options>
                                <button pButton pRipple icon="pi pi-inbox" class="h-8 w-8 mr-2" (click)="onArchive($event, mail.id)" pTooltip="Archive" tooltipPosition="top" type="button"></button>
                                <button pButton pRipple icon="pi pi-reply" class="h-8 w-8 mr-2" severity="secondary" (click)="onReply($event, mail)" pTooltip="Reply" tooltipPosition="top" type="button"></button>
                                <button pButton pRipple icon="pi pi-trash" class="h-8 w-8rem" severity="danger" (click)="onTrash($event, mail)" pTooltip="Trash" tooltipPosition="top" type="button"></button>
                            </div>
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog
            [(visible)]="dialogVisible"
            (onHide)="dialogVisible = false"
            [closable]="true"
            header="New Message"
            [modal]="true"
            styleClass="mx-4 sm:mx-0 sm:w-full md:w-8/12 lg:w-6/12"
            contentStyleClass="rounded-b border-t border-surface-200 dark:border-surface-700 p-0"
        >
            <app-mail-reply [content]="mail" (hide)="dialogVisible = false"></app-mail-reply>
        </p-dialog>`
})
export class MailTableComponent implements OnInit {
    @Input() mails!: Mail[];

    menuItems: MenuItem[] = [];

    selectedMails: Mail[] = [];

    mail: Mail = {};

    dialogVisible: boolean = false;

    constructor(
        private router: Router,
        private mailService: MailService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.menuItems = [
            {
                label: 'Archive',
                icon: 'pi pi-fw pi-file',
                command: () => this.onArchiveMultiple()
            },
            {
                label: 'Spam',
                icon: 'pi pi-fw pi-ban',
                command: () => this.onSpamMultiple()
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: () => this.onDeleteMultiple()
            }
        ];
    }

    toggleOptions(event: Event, opt: HTMLElement, date: HTMLElement) {
        if (event.type === 'mouseenter') {
            opt.style.display = 'flex';
            date.style.display = 'none';
        } else {
            opt.style.display = 'none';
            date.style.display = 'flex';
        }
    }

    onRowSelect(id: number) {
        this.router.navigate(['/apps/mail/detail/', id]);
    }

    onStar(event: Event, id: number) {
        event.stopPropagation();
        this.mailService.onStar(id);
    }

    onArchive(event: Event, id: number) {
        event.stopPropagation();
        this.mailService.onArchive(id);
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Mail archived',
            life: 3000
        });
    }

    onBookmark(event: Event, id: number) {
        event.stopPropagation();
        this.mailService.onBookmark(id);
    }

    onDelete(id: number) {
        this.mailService.onDelete(id);
        this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Mail deleted',
            life: 3000
        });
    }

    onDeleteMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onDeleteMultiple(this.selectedMails);
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Mails deleted',
                life: 3000
            });
        }
    }

    onSpamMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onSpamMultiple(this.selectedMails);
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Moved to spam',
                life: 3000
            });
        }
    }

    onArchiveMultiple() {
        if (this.selectedMails && this.selectedMails.length > 0) {
            this.mailService.onArchiveMultiple(this.selectedMails);
            this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Moved to archive',
                life: 3000
            });
        }
    }

    onTrash(event: Event, mail: Mail) {
        event.stopPropagation();
        if (mail.trash) {
            this.onDelete(mail.id);
        }
        this.mailService.onTrash(mail.id);
    }

    onReply(event: Event, mail: Mail) {
        event.stopPropagation();
        this.mail = mail;
        this.dialogVisible = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
