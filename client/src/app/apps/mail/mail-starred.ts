import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';
import { Mail } from '@/types/mail';

@Component({
    selector: 'app-mail-starred',
    standalone: true,
    imports: [MailTableComponent],
    template: `<app-mail-table [mails]="starredMails"></app-mail-table>`
})
export class MailStarredComponent implements OnDestroy {
    starredMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.starredMails = data.filter((d) => d.starred && !d.archived && !d.trash);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
