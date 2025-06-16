import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from './service/chat.service';
import { ChatSidebar } from './chatsidebar';
import { ChatBox } from './chatbox';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [ChatSidebar, ChatBox],
    template: `<div class="flex flex-col md:flex-row gap-8" style="min-height: 81vh">
        <div class="md:w-[25rem] card !p-0">
            <app-chat-sidebar></app-chat-sidebar>
        </div>
        <div class="flex-1 card !p-0">
            <app-chat-box [user]="activeUser"></app-chat-box>
        </div>
    </div> `,
    providers: [ChatService]
})
export class Chat {
    subscription: Subscription;

    activeUser!: any;

    constructor(private chatService: ChatService) {
        this.subscription = this.chatService.activeUser$.subscribe((data) => (this.activeUser = data));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
