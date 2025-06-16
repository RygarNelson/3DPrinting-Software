import { Component, Input } from '@angular/core';
import { Message } from 'primeng/message';
import { ChatService } from './service/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-chat-box',
    standalone: true,
    imports: [FormsModule, CommonModule, PopoverModule, InputTextModule, ButtonModule],
    template: `<div class="flex flex-col h-full">
            <div class="flex items-center border-b border-surface-200 dark:border-surface-700 p-4 lg:p-12">
                <div class="relative flex items-center mr-4">
                    <img src="/demo/images/avatar/{{ user.image }}" alt="user.name" class="w-16 h-16 rounded-full shadow-lg" />
                    <span
                        class="w-4 h-4 rounded-full border-2 border-surface-200 dark:border-surface-700 absolute bottom-0 right-0"
                        [ngClass]="{
                            'bg-green-400': user.status === 'active',
                            'bg-red-400': user.status === 'busy',
                            'bg-yellow-400': user.status === 'away'
                        }"
                    ></span>
                </div>
                <div class="mr-2">
                    <span class="text-surface-900 dark:text-surface-0 font-semibold block">{{ user.name }}</span>
                    <span class="text-surface-700 dark:text-surface-100">Last active 1 hour ago</span>
                </div>
                <div class="flex items-center ml-auto">
                    <button pButton icon="pi pi-phone" class="mr-4" outlined severity="secondary" rounded></button>
                    <button pButton icon="pi pi-ellipsis-v" outlined severity="secondary" rounded></button>
                </div>
            </div>
            <div class="user-message-container p-4 md:px-6 lg:px-12 lg:py-6 mt-2 overflow-y-auto" style="max-height: 53vh;" #chatWindow [scrollTop]="chatWindow.scrollHeight">
                <div *ngFor="let message of user.messages">
                    <div *ngIf="message.ownerId !== 123" class="grid gap-4 grid-nogutter mb-6">
                        <div class="mr-4 mt-1">
                            <img src="/demo/images/avatar/{{ user.image }}" alt="user.name" class="w-12 h-12 rounded-full shadow-lg" />
                        </div>
                        <div class="col mt-4">
                            <p class="text-surface-900 dark:text-surface-0 font-semibold mb-4">
                                {{ user.name }}
                            </p>
                            <span class="text-surface-700 dark:text-surface-100 inline-block font-medium border border-surface-200 dark:border-surface-700 p-4 whitespace-normal rounded" style="word-break: break-word; max-width:80%;">{{
                                message.text
                            }}</span>
                            <p class="text-surface-700 dark:text-surface-100 mt-4">{{ parseDate(message.createdAt) }}<i class="pi pi-check ml-2 text-green-400"></i></p>
                        </div>
                    </div>

                    <div *ngIf="message.ownerId === defaultUserId" class="grid gap-4 grid-nogutter mb-6">
                        <div class="col mt-4 text-right">
                            <span class="inline-block text-left font-medium border border-surface-200 dark:border-surface-700 bg-primary-100 text-primary-900 p-4 whitespace-normal rounded" style="word-break: break-word; max-width:80%;">{{
                                message.text
                            }}</span>
                            <p class="text-surface-700 dark:text-surface-100 mt-4">
                                {{ parseDate(message.createdAt) }}
                                <i class="pi pi-check ml-2 text-green-400"></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 md:p-6 lg:p-12 flex flex-col sm:flex-row items-center mt-auto border-t border-surface-200 dark:border-surface-700 gap-4">
                <input id="message" type="text" pInputText placeholder="Type a message" class="flex-1 w-full sm:w-auto rounded" [(ngModel)]="textContent" (keydown.enter)="sendMessage()" />
                <div class="flex w-full sm:w-auto gap-4">
                    <button pRipple class="w-full sm:w-auto justify-center text-xl" severity="secondary" (click)="op.toggle($event)">😀</button>
                    <button pButton pRipple label="Send" icon="pi pi-send" class="w-full sm:w-auto" (click)="sendMessage()"></button>
                </div>
            </div>
        </div>

        <p-popover #op styleClass="w-full sm:w-30rem">
            <ng-template #content>
                <button *ngFor="let emoji of emojis" pButton pRipple (click)="op.hide(); onEmojiSelect(emoji)" type="button" [label]="emoji" class="p-2 text-2xl" text></button>
            </ng-template>
        </p-popover> `
})
export class ChatBox {
    defaultUserId: number = 123;

    message!: Message;

    textContent: string = '';

    uploadedFiles: any[] = [];

    emojis = [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😇',
        '😉',
        '😊',
        '🙂',
        '🙃',
        '😋',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '🤪',
        '😜',
        '😝',
        '😛',
        '🤑',
        '😎',
        '🤓',
        '🧐',
        '🤠',
        '🥳',
        '🤗',
        '🤡',
        '😏',
        '😶',
        '😐',
        '😑',
        '😒',
        '🙄',
        '🤨',
        '🤔',
        '🤫',
        '🤭',
        '🤥',
        '😳',
        '😞',
        '😟',
        '😠',
        '😡',
        '🤬',
        '😔',
        '😟',
        '😠',
        '😡',
        '🤬',
        '😔',
        '😕',
        '🙁',
        '😬',
        '🥺',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥱',
        '😤',
        '😮',
        '😱',
        '😨',
        '😰',
        '😯',
        '😦',
        '😧',
        '😢',
        '😥',
        '😪',
        '🤤'
    ];

    @Input() user!: any;

    constructor(private chatService: ChatService) {}

    setMessage() {
        if (this.user) {
            let filteredMessages = this.user.messages.filter((m: any) => m.ownerId !== this.defaultUserId);
            this.message = filteredMessages[filteredMessages.length - 1];
        }
    }

    ngOnInit() {
        this.setMessage();
    }

    sendMessage() {
        if (this.textContent == '' || this.textContent === ' ') {
            return;
        } else {
            let message = {
                text: this.textContent,
                ownerId: 123,
                createdAt: new Date().getTime()
            };

            this.chatService.sendMessage(message as any);
            this.textContent = '';
        }
    }

    onEmojiSelect(emoji: string) {
        this.textContent += emoji;
    }

    parseDate(timestamp: number) {
        return new Date(timestamp).toTimeString().split(':').slice(0, 2).join(':');
    }
}
