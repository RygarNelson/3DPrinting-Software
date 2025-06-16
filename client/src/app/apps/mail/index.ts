import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MailSidebarComponent } from './mail-sidebar';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MailService } from './service/mail.service';

@Component({
    standalone: true,
    imports: [ToastModule, MailSidebarComponent, RouterModule],
    template: `
        <p-toast></p-toast>
        <div class="card">
            <div class="flex flex-col md:flex-row gap-6">
                <div class="w-full md:w-3/12 xl:w-2/12 xl:p-4">
                    <app-mail-sidebar></app-mail-sidebar>
                </div>
                <div class="md:w-9/12 xl:w-10/12 xl:p-4">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService, MailService]
})
export class MailAppComponent {}
