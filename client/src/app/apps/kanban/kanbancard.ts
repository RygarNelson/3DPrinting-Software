import { Component, Input, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { KanbanService } from '@/apps/kanban/service/kanban.service';
import { KanbanCardType } from '@/types/kanban';
import { CommonModule } from '@angular/common';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
    selector: 'kanban-card',
    standalone: true,
    imports: [CommonModule, TieredMenuModule, ButtonModule, RippleModule, AvatarModule, ProgressBarModule, AvatarGroupModule, CdkDragHandle],
    template: `<div [id]="card.id" class="flex bg-surface-0 dark:bg-surface-900 flex-col w-full border border-surface p-4 gap-8 hover:bg-surface-50 dark:hover:bg-surface-950 cursor-pointer rounded-border" cdkDragHandle>
        <div class="flex justify-between items-center">
            <span class="text-surface-900 dark:text-surface-0 font-semibold">{{ card.title ? card.title : 'Untitled' }}</span>
            <div>
                <button pButton pRipple type="button" icon="pi pi-ellipsis-v" rounded text severity="secondary" class="p-trigger" (click)="menu.toggle($event)"></button>
                <p-tiered-menu #menu [model]="menuItems" appendTo="body" [popup]="true"></p-tiered-menu>
            </div>
        </div>
        <div *ngIf="card.description" style="word-break: break-word" class="text-surface-700 dark:text-surface-100">{{ card.description }}</div>
        <p-progress-bar *ngIf="card.taskList.tasks.length" [value]="card.progress" [showValue]="false" [style]="{ height: '.5rem' }"></p-progress-bar>

        <div class="flex items-center justify-between flex-col md:flex-row gap-6 md:gap-0">
            <p-avatar-group>
                <p-avatar *ngFor="let assignee of card.assignees | slice: 0 : 3" image="/demo/images/avatar/{{ assignee.image }}" shape="circle" styleClass="border-2 border-surface"></p-avatar>
                <p-avatar *ngIf="card.assignees && card.assignees.length > 3" label="+ {{ card.assignees.length - 3 }}" shape="circle" styleClass="border-2 border-surface mb-1 bg-surface-50 dark:bg-surface-950"></p-avatar>
            </p-avatar-group>
            <div *ngIf="card.attachments || card.dueDate" class="flex items-center gap-4">
                <span class="text-surface-900 dark:text-surface-0 font-semibold flex-shrink-0" *ngIf="card.taskList.tasks.length"><i class="pi pi-check-square text-surface-700 dark:text-surface-100 mr-2"></i>{{ generateTaskInfo() }}</span>
                <span class="text-surface-900 dark:text-surface-0 font-semibold flex-shrink-0" *ngIf="card.attachments"><i class="pi pi-paperclip text-surface-700 dark:text-surface-100 mr-2"></i>{{ card.attachments }}</span>
                <span class="text-surface-900 dark:text-surface-0 font-semibold flex-shrink-0" *ngIf="card.dueDate"><i class="pi pi-clock text-surface-700 dark:text-surface-100 mr-2"></i>{{ parseDate(card.dueDate) }}</span>
            </div>
        </div>
    </div>`
})
export class KanbanCard implements OnDestroy {
    @Input() card!: KanbanCardType;

    @Input() listId!: string;

    menuItems: MenuItem[] = [];

    subscription: Subscription;

    constructor(private kanbanService: KanbanService) {
        this.subscription = this.kanbanService.lists$.subscribe((data) => {
            let subMenu = data.map((d) => ({ id: d.listId, label: d.title, command: () => this.onMove(d.listId) }));
            this.generateMenu(subMenu);
        });
    }

    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }

    onDelete() {
        this.kanbanService.deleteCard(this.card.id, this.listId);
    }

    onCopy() {
        this.kanbanService.copyCard(this.card, this.listId);
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.card, listId, this.listId);
    }

    generateMenu(subMenu: any[]) {
        this.menuItems = [
            { label: 'Copy card', command: () => this.onCopy() },
            { label: 'Move card', items: subMenu },
            { label: 'Delete card', command: () => this.onDelete() }
        ];
    }

    generateTaskInfo() {
        let total = this.card.taskList.tasks.length;
        let completed = this.card.taskList.tasks.filter((t) => t.completed).length;
        return `${completed} / ${total}`;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
