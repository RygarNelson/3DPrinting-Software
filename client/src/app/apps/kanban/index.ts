import {Component} from '@angular/core';
import {KanbanService} from '@/apps/kanban/service/kanban.service';
import {KanbanSidebar} from '@/apps/kanban/kanbansidebar';
import {KanbanListType} from '@/types/kanban';
import {KanbanList} from '@/apps/kanban/kanbanlist';
import {CommonModule} from '@angular/common';
import {RippleModule} from 'primeng/ripple';
import {ButtonModule} from 'primeng/button';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs';

@Component({
    selector: 'kanban',
    standalone: true,
    imports: [KanbanSidebar, KanbanList, CommonModule, ButtonModule, RippleModule, DragDropModule],
    template: `<div id="kanban-wrapper" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="dropList($event)" [cdkDropListData]="lists" class="flex gap-8 w-full flex-col md:flex-row flex-nowrap lg:overflow-y-hidden overflow-x-auto">
        <kanban-list *ngFor="let list of lists; let i = index" [list]="list" [listIds]="listIds" cdkDrag cdkDragHandle [cdkDragDisabled]="isMobileDevice" class="p-kanban-list"></kanban-list>
        <div class="px-4 py-1 mb-4 md:w-[25rem] shrink-0">
            <button pButton pRipple label="New List" icon="pi pi-plus font-semibold" class="py-4 justify-center font-semibold w-full rounded" (click)="addList()"></button>
        </div>
        <kanban-sidebar></kanban-sidebar>
    </div>`,
    styles: `
        :host {
            ::-webkit-scrollbar {
                height: 6px;
            }

            ::-webkit-scrollbar-track {
                background: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background-color: var(--gray-500);
                border-radius: 20px;
            }
        }

        :host ::ng-deep {
            .p-button-label {
                flex: 0;
                white-space: nowrap;
            }

            .p-inplace {
                .p-inplace-content {
                    .p-inputtext {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    .p-button {
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                        width: 3rem;
                        height: 3rem;
                    }
                }

                .p-inplace-display {
                    padding: 0;
                }
            }
        }

        .p-kanban-list {
            cursor: pointer;
            height: min-content;
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
    `,
    providers: [KanbanService]
})
export class Kanban {
    sidebarVisible: boolean = false;

    lists: KanbanListType[] = [];

    listIds: string[] = [];

    subscription = new Subscription();

    style!: HTMLStyleElement;

    isMobileDevice: boolean = false;

    constructor(private kanbanService: KanbanService) {
        this.subscription = this.kanbanService.lists$.subscribe((data) => {
            this.lists = data;
            this.listIds = this.lists.map((l) => l.listId || '');
        });
    }

    ngOnInit() {
        this.removeLayoutResponsive();
        this.isMobileDevice = this.kanbanService.isMobileDevice();
    }

    toggleSidebar() {
        this.sidebarVisible = true;
    }

    addList() {
        this.kanbanService.addList();
    }

    dropList(event: CdkDragDrop<KanbanListType[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    removeLayoutResponsive() {
        this.style = document.createElement('style');
        this.style.innerHTML = `
                .layout-content {
                    width: 100%;
                }

                .layout-topbar {
                    width: 100%;
                }
            `;
        document.head.appendChild(this.style);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        document.head.removeChild(this.style);
    }
}
