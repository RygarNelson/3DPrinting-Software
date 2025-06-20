import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InplaceModule} from 'primeng/inplace';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {MenuModule} from 'primeng/menu';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MenuItem} from 'primeng/api';
import {Kanban} from '@/apps/kanban/index';
import {KanbanService} from '@/apps/kanban/service/kanban.service';
import {KanbanCardType, KanbanListType} from '@/types/kanban';
import {KanbanCard} from '@/apps/kanban/kanbancard';
import {TooltipModule} from 'primeng/tooltip';

@Component({
    selector: 'kanban-list',
    standalone: true,
    imports: [CommonModule, InplaceModule, ButtonModule, RippleModule, MenuModule, KanbanCard, FormsModule, InputTextModule, CdkDropList, CdkDrag, TooltipModule],
    template: `
        <div class="flex justify-between items-center w-full">
            <p-inplace>
                <ng-template #display>
                    <span class="text-lg font-semibold">{{ list.title }}</span>
                </ng-template>
                <ng-template #content let-closeCallback="closeCallback">
                    <span class="inline-flex items-center gap-1 h-10">
                        <input type="text" autofocus pInputText [value]="list.title" [(ngModel)]="list.title" class="h-full !rounded-r-none w-[10rem]" />
                        <button (click)="closeCallback($event)" pButton icon="pi pi-check" class="!rounded-l-none !h-10"></button>
                    </span>
                </ng-template>
            </p-inplace>
            <div>
                <button pButton pRipple type="button" icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-secondary" (click)="menu.toggle($event)"></button>
                <p-menu #menu [model]="menuItems" [popup]="true" appendTo="body"></p-menu>
            </div>
        </div>
        <div
            [id]="list.listId"
            class="flex flex-col gap-8 overflow-y-auto  mt-6 scrollable kanban-list"
            cdkDropList
            (cdkDropListDropped)="dropCard($event)"
            (cdkDropListEntered)="insertHeight($event)"
            (cdkDropListExited)="removeHeight($event)"
            [cdkDropListData]="list.cards"
            [cdkDropListConnectedTo]="listIds"
            #listEl
            style="min-height:2rem"
        >
            <kanban-card *ngFor="let card of list.cards" [card]="card" [listId]="list.listId" (click)="onCardClick($event, card)" cdkDrag [cdkDragDisabled]="isMobileDevice"></kanban-card>
        </div>
        <div class="px-6 mb-4 w-full mt-6 flex">
            <button pButton pRipple label="New Card" icon="pi pi-plus font-semibold" class="py-4 justify-center font-semibold w-full rounded-border" (click)="insertCard()"></button>
        </div>
    `,
    host: {
        class: 'card md:w-[25rem] overflow-hidden shadow-md !rounded-border flex-shrink-0'
    },
    styles: `
        :host ::ng-deep {
            .p-button-label {
                flex: 0;
                white-space: nowrap;
            }

            .scrollable {
                scroll-behavior: smooth;
                max-height: 70vh;
            }
        }

        :host {
            ::-webkit-scrollbar {
                width: 6px;
            }

            ::-webkit-scrollbar-track {
                background: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background-color: var(--p-gray-500);
                border-radius: 20px;
            }
        }

        .cdk-drag-preview {
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow:
                0 5px 5px -3px rgba(0, 0, 0, 0.2),
                0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .cdk-drag-placeholder {
            opacity: 0.25;
        }

        .cdk-drag-animating {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
    `
})
export class KanbanList implements OnInit {
    @Input() list!: KanbanListType;

    @Input() listIds!: string[];

    menuItems: MenuItem[] = [];

    title: string = '';

    timeout: any = null;

    isMobileDevice: boolean = false;

    @ViewChild('inputEl') inputEl!: ElementRef;

    @ViewChild('listEl') listEl!: ElementRef;

    constructor(
        public parent: Kanban,
        private kanbanService: KanbanService
    ) {}

    ngOnInit(): void {
        this.isMobileDevice = this.kanbanService.isMobileDevice();

        this.menuItems = [
            {
                label: 'List actions',
                items: [
                    { separator: true },
                    { label: 'Copy list', command: () => this.onCopy(this.list) },
                    {
                        label: 'Remove list',
                        command: () => {
                            if (this.list.listId) {
                                this.onDelete(this.list.listId);
                            }
                        }
                    }
                ]
            }
        ];
    }

    toggleSidebar() {
        this.parent.sidebarVisible = true;
    }

    onDelete(id: string) {
        this.kanbanService.deleteList(id);
    }

    onCopy(list: KanbanListType) {
        this.kanbanService.copyList(list);
    }

    onCardClick(event: Event, card: KanbanCardType) {
        const eventTarget = event.target as HTMLElement;
        if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
            if (this.list.listId) {
                this.kanbanService.onCardSelect(card, this.list.listId);
            }
            this.parent.sidebarVisible = true;
        }
    }

    insertCard() {
        if (this.list.listId) {
            this.kanbanService.addCard(this.list.listId);
        }
    }

    dropCard(event: CdkDragDrop<KanbanCardType[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }
}
