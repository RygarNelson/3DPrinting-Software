import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MailService } from './service/mail.service';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { Mail } from '@/types/mail';

@Component({
    standalone: true,
    imports: [AvatarModule, ButtonModule, RippleModule, CommonModule, EditorModule, FormsModule],
    template: `<div *ngIf="mail">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pt-8 md:pt-0 gap-6 md:border-t-0 border-t border-surface-200 dark:border-surface-700">
            <div class="flex items-center md:justify-start">
                <button pButton pRipple type="button" icon="pi pi-chevron-left" class="md:mr-4" text plain (click)="goBack()"></button>
                <p-avatar *ngIf="mail && mail.image" [image]="'/demo/images/avatar/' + mail.image" size="large" shape="circle" styleClass="border-2 border-surface-200 dark:border-surface-700"></p-avatar>
                <div class="flex flex-col mx-4">
                    <span class="block text-surface-900 dark:text-surface-0 font-bold text-lg">{{ mail.from }}</span>
                    <span class="block text-surface-900 dark:text-surface-0 font-semibold">To: {{ mail.email || mail.to }}</span>
                </div>
            </div>
            <div class="flex items-center justify-end gap-x-4 px-6 md:px-0">
                <span class="text-surface-900 dark:text-surface-0 font-semibold whitespace-nowrap mr-auto">{{ mail.date }}</span>
                <button pButton pRipple type="button" icon="pi pi-reply" class="flex-shrink-0" text plain></button>
                <button pButton pRipple type="button" icon="pi pi-ellipsis-v" class="flex-shrink-0" text plain></button>
            </div>
        </div>
        <div class="border-surface-200 dark:border-surface-700 border rounded p-6">
            <div class="text-surface-900 dark:text-surface-0 font-semibold text-lg mb-4">
                {{ mail.title }}
            </div>
            <p class="leading-normal mt-0 mb-4" [innerHTML]="mail.message"></p>
            <p-editor [style]="{ height: '250px' }" [(ngModel)]="newMail.message"></p-editor>
            <div class="flex gap-x-4 justify-end mt-4">
                <button pButton pRipple type="button" outlined icon="pi pi-image"></button>
                <button pButton pRipple type="button" outlined icon="pi pi-paperclip"></button>
                <button pButton pRipple type="button" icon="pi pi-send" label="Send" (click)="sendMail()"></button>
            </div>
        </div>
    </div> `
})
export class MailDetailComponent implements OnDestroy {
    newMail: Mail = {
        id: '',
        to: '',
        email: '',
        image: '',
        title: '',
        message: '',
        date: '',
        important: false,
        starred: false,
        trash: false,
        spam: false,
        archived: false,
        sent: true
    };

    subscription: Subscription;

    mail: Mail = {};

    id: any;

    constructor(
        private route: ActivatedRoute,
        private mailService: MailService,
        private location: Location,
        private router: Router,
        private messageService: MessageService
    ) {
        this.subscription = this.route.params
            .pipe(
                switchMap((params) => {
                    this.id = params['id'];
                    return this.mailService.mails$;
                })
            )
            .subscribe((data) => {
                this.mail = data.filter((d) => d.id == this.id)[0];
            });
    }

    goBack() {
        this.location.back();
    }

    sendMail() {
        if (this.newMail.message) {
            this.newMail.to = this.mail.from ? this.mail.from : this.mail.to;
            this.newMail.image = this.mail.image;

            this.mailService.onSend(this.newMail);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Mail sent'
            });
            this.router.navigate(['apps/mail/inbox']);
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
