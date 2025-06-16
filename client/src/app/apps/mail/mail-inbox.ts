import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Mail } from '@/types/mail';
import { MailService } from './service/mail.service';
import { MailTableComponent } from './mail-table';

@Component({
    selector: 'app-mail-inbox',
    standalone: true,
    imports: [MailTableComponent],
    template: `<app-mail-table [mails]="mails"></app-mail-table>`
})
export class MailInboxComponent implements OnDestroy {
    mails: Mail[] = [];

    subscription: Subscription;

    constructor(
        private mailService: MailService,
        private router: Router
    ) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.mails = data.filter((d) => !d.archived && !d.spam && !d.trash && !d.hasOwnProperty('sent'));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
