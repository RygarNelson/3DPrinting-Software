import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from '@/types/mail';

@Component({
    template: `<app-mail-table [mails]="trashMails"></app-mail-table>`,
    standalone: true,
    imports: [MailTableComponent]
})
export class MailTrashComponent implements OnDestroy {
    trashMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.trashMails = data.filter((d) => d.trash);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
