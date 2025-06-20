import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from '@/types/mail';

@Component({
    selector: 'app-mail-spam',
    standalone: true,
    imports: [MailTableComponent],
    template: `<app-mail-table [mails]="spamMails"></app-mail-table> `
})
export class MailSpamComponent implements OnDestroy {
    spamMails!: Mail[];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.spamMails = data.filter((d) => d.spam && !d.archived && !d.trash && !d.hasOwnProperty('sent'));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
