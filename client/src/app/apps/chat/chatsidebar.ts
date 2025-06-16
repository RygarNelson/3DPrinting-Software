import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChatService } from './service/chat.service';
import { UserCard } from './usercard';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-chat-sidebar',
    standalone: true,
    imports: [CommonModule, IconFieldModule, InputIconModule, FormsModule, UserCard, InputTextModule],
    template: `<div class="flex flex-col items-center border-b border-surface-200 dark:border-surface-700 p-12">
            <img src="/demo/images/avatar/circle/avatar-f-1@2x.png" class="w-24 h-24 rounded-full shadow-lg" alt="Asiya Javayant" />
            <span class="text-surface-900 dark:text-surface-0 text-xl font-semibold mt-6">Asiya Javayant</span>
        </div>
        <div class="w-full flex gap-y-6 flex-col border-surface-200 dark:border-surface-700 p-6">
            <p-iconfield class="w-full">
                <p-inputicon class="pi pi-search" />
                <input id="search" type="text" pInputText placeholder="Search" class="w-full" [(ngModel)]="searchValue" (input)="filter()" />
            </p-iconfield>

            <div class="flex flex-row gap-6 md:flex-col overflow-auto">
                <app-user-card *ngFor="let user of filteredUsers" [user]="user"></app-user-card>
            </div>
        </div> `
})
export class ChatSidebar {
    searchValue: string = '';

    users: any[] = [];

    filteredUsers: any[] = [];

    constructor(private chatService: ChatService) {}

    ngOnInit(): void {
        this.chatService.getChatData().then((data) => {
            this.users = data;
            this.filteredUsers = this.users;
        });
    }

    filter() {
        let filtered: any[] = [];
        for (let i = 0; i < this.users.length; i++) {
            let user = this.users[i];
            if (user.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) == 0) {
                filtered.push(user);
            }
        }

        this.filteredUsers = [...filtered];
    }
}
