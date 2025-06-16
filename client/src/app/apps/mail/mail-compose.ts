import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MailService } from './service/mail.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EditorModule } from 'primeng/editor';
import { Mail } from '@/types/mail';

@Component({
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, RippleModule, InputTextModule, IconFieldModule, InputIconModule, EditorModule],
    template: `<div class="flex items-center px-6 md:px-0 border-t border-surface-200 dark:border-surface-700 md:border-0 pt-6 md:pt-0">
            <button pButton pRipple type="button" icon="pi pi-chevron-left" class="border-surface-200 dark:border-surface-700 text-surface-900 dark:text-surface-0 w-12 h-12 mr-4" outlined severity="secondary" (click)="goBack()"></button>
            <span class="block text-surface-900 dark:text-surface-0 font-bold text-xl">Compose Message</span>
        </div>
        <div class="bg-surface-0 dark:bg-surface-950 grid gap-4 mt-6 grid-nogutter p-6 md:border-surface-200 dark:md:border-surface-700 md:border rounded">
            <div class="col-span-12">
                <label for="to" class="text-surface-900 dark:text-surface-0 font-semibold">To</label>
                <p-iconfield style="height: 3.5rem" class="mt-4">
                    <p-inputicon class="pi pi-user" style="left: 1.5rem" />
                    <input id="to" type="text" pInputText [(ngModel)]="newMail.to" class="!pl-16 text-surface-900 dark:text-surface-0 font-semibold" style="height: 3.5rem" fluid />
                </p-iconfield>
            </div>
            <div class="col-span-12">
                <label for="Subject" class="text-surface-900 dark:text-surface-0 font-semibold">Subject</label>
                <p-iconfield style="height: 3.5rem" class="mt-4">
                    <p-inputicon class="pi pi-pencil" style="left: 1.5rem" />
                    <input id="subject" type="text" pInputText [(ngModel)]="newMail.title" class="!pl-16 text-surface-900 dark:text-surface-0 font-semibold" fluid style="height: 3.5rem" />
                </p-iconfield>
            </div>
            <div class="col-span-12">
                <p-editor [style]="{ height: '250px' }" [(ngModel)]="newMail.message"></p-editor>
            </div>
            <div class="col-span-12 flex gap-x-4 justify-end mt-16">
                <button pButton pRipple type="button" class="h-12 w-full sm:w-auto" icon="pi pi-send" label="Send Message" (click)="sendMail()"></button>
            </div>
        </div>`
})
export class MailComposeComponent {
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

    constructor(
        private messageService: MessageService,
        private location: Location,
        private router: Router,
        private mailService: MailService
    ) {}

    sendMail() {
        if (this.newMail.message) {
            this.newMail.id = Math.floor(Math.random() * 1000);
            this.mailService.onSend(this.newMail);
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Mail sent'
            });
            this.router.navigate(['apps/mail/inbox']);
        }
    }

    goBack() {
        this.location.back();
    }
}
