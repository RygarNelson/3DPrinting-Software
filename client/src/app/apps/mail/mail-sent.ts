import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from '@/types/mail';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';

@Component({
    standalone: true,
    imports: [MailTableComponent],
    template: `<app-mail-table [mails]="sentMails"></app-mail-table>`
})
export class MailSentComponent {
    sentMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.sentMails = data.filter((d) => d.sent && !d.trash && !d.archived);
        });
    }
}
