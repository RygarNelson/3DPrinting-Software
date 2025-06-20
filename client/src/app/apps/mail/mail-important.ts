import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail } from '@/types/mail';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';

@Component({
    selector: 'app-mail-important',
    standalone: true,
    imports: [MailTableComponent],
    template: `<app-mail-table [mails]="importantMails"></app-mail-table>`
})
export class MailImportantComponent implements OnDestroy {
    importantMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.importantMails = data.filter((d) => d.important && !d.spam && !d.trash && !d.archived);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
