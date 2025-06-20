import {Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DrawerModule} from 'primeng/drawer';
import {PopoverModule} from 'primeng/popover';
import {TooltipModule} from 'primeng/tooltip';
import {CheckboxModule} from 'primeng/checkbox';
import {InplaceModule} from 'primeng/inplace';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ProgressBarModule} from 'primeng/progressbar';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {DatePickerModule} from 'primeng/datepicker';
import {Comment, KanbanCardType, ListName, Task} from '@/types/kanban';
import {Member} from '@/types/member';
import {Subscription} from 'rxjs';
import {Kanban} from '@/apps/kanban/index';
import {MemberService} from '@/pages/service/member.service';
import {KanbanService} from '@/apps/kanban/service/kanban.service';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {StyleClassModule} from 'primeng/styleclass';

@Component({
    selector: 'kanban-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DrawerModule,
        PopoverModule,
        TooltipModule,
        InplaceModule,
        AutoCompleteModule,
        ProgressBarModule,
        AvatarModule,
        CheckboxModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        RippleModule,
        DatePickerModule,
        OverlayPanelModule,
        StyleClassModule
    ],
    template: `<p-drawer *ngIf="formValue" #sidebar [(visible)]="parent.sidebarVisible" position="right" [baseZIndex]="10000" styleClass="!w-full lg:!w-[50rem] overflow-auto" [showCloseIcon]="false">
        <ng-template #headless>
            <form (submit)="onSave($event)">
                <div class="px-6 py-12 border-b border-surface flex items-center justify-between h-16">
                    <p-inplace #inplace>
                        <ng-template #display>
                            <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg" pTooltip="Click to edit">{{ formValue.title ? formValue.title : 'Untitled' }}</span>
                        </ng-template>
                        <ng-template #content let-closeCallback="closeCallback">
                            <span class="inline-flex items-center gap-1 h-10">
                                <input #inputTitle type="text" name="title" autofocus [(ngModel)]="formValue.title" pInputText class="h-full !rounded-r-none" (keydown.enter)="inplace.deactivate()" />
                                <button (click)="closeCallback($event)" pButton icon="pi pi-check" class="!rounded-l-none !h-10"></button>
                            </span>
                        </ng-template>
                    </p-inplace>
                    <div class="flex relative">
                        <button pButton pRipple type="button" icon="pi pi-cog" severity="secondary" rounded text pTooltip="Card Actions" tooltipPosition="left" #action1 pStyleClass="#op" enterFromClass="!hidden" leaveToClass="!hidden"></button>
                        <button pButton pRipple type="button" icon="pi pi-times" severity="secondary" rounded text (click)="close()"></button>

                        <div id="op" class="card z-50 absolute shadow-md !rounded-md border border-gray-100 dark:!border-gray-600 !hidden" style="right: 50px; top:45px;">
                            <div class="grid grid-cols-12 gap-4 flex-col w-60">
                                <div class="col-span-12 flex flex-col">
                                    <span class="text-surface-900 dark:text-surface-0 font-semibold block w-full border-b border-surface pb-4 mb-2">Move to...</span>
                                    <span
                                        pRipple
                                        class="text-surface-700 dark:text-surface-100 block p-2 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-950 select-none rounded-border"
                                        *ngFor="let list of listNames"
                                        (click)="onMove(list.listId || '')"
                                    >{{ list.title }}</span
                                    >
                                </div>
                                <div class="col-span-12 flex flex-col">
                                    <span class="text-surface-900 dark:text-surface-0 font-semibold block w-full border-b border-surface pb-4 mb-2">Tasks</span>
                                    <span pRipple class="text-surface-700 dark:text-surface-100 block p-2 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-950 select-none rounded-border" (click)="addTaskList()">Create a tasklist</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-8 pt-8 flex-wrap flex-1 flex-col">
                    <div class="col-span-12 field px-8 flex flex-col gap-4">
                        <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Description</label>
                        <textarea id="description" name="description" type="text" pTextarea [rows]="5" [(ngModel)]="formValue.description" style="resize: none" class="w-full"></textarea>
                    </div>
                    <div class="col-span-12 px-8 flex gap-4">
                        <div class="flex flex-col field w-full gap-4">
                            <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Start Date</label>
                            <p-datepicker
                                name="startDate"
                                dateFormat="yy-mm-dd"
                                [showTime]="false"
                                [required]="true"
                                [showIcon]="true"
                                inputId="start"
                                inputStyleClass="w-full text-surface-900 dark:text-surface-0 font-semibold"
                                styleClass="w-full"
                                [(ngModel)]="formValue.startDate"
                            ></p-datepicker>
                        </div>
                        <div class="flex flex-col field w-full gap-4">
                            <label for="due" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Due Date</label>
                            <p-datepicker
                                name="endDate"
                                dateFormat="yy-mm-dd"
                                [showTime]="false"
                                [required]="true"
                                [showIcon]="true"
                                inputId="due"
                                inputStyleClass="w-full text-surface-900 dark:text-surface-0 font-semibold"
                                styleClass="w-full"
                                [(ngModel)]="formValue.dueDate"
                            ></p-datepicker>
                        </div>
                    </div>

                    <div *ngIf="formValue.taskList.tasks.length || showTaskContainer" class="col-span-12 flex flex-col px-8">
                        <div class="flex justify-between mb-4">
                            <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg">Progress</span>
                            <span class="text-surface-900 dark:text-surface-0 font-semibold">{{ formValue.progress }}%</span>
                        </div>
                        <p-progress-bar name="progress" [value]="formValue.progress" [showValue]="false" styleClass="!h-1"></p-progress-bar>
                    </div>

                    <div *ngIf="formValue.taskList.tasks.length || showTaskContainer" class="col-span-12 flex flex-col px-8">
                        <div class="h-16 -mb-6">
                            <p-inplace #inplace>
                                <ng-template #display>
                                    <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg" pTooltip="Click to edit">{{ formValue.taskList.title }}</span>
                                </ng-template>
                                <ng-template #content let-closeCallback="closeCallback">
                                    <span class="inline-flex items-center gap-1 h-10">
                                        <input
                                            #inputTaskListTitle
                                            type="text"
                                            name="title"
                                            autofocus
                                            [(ngModel)]="formValue.taskList.title"
                                            pInputText
                                            class="h-full !rounded-r-none"
                                            (keydown.enter)="inplace.deactivate()"
                                        />
                                        <button (click)="closeCallback($event)" pButton icon="pi pi-check" class="!rounded-l-none !h-10"></button>
                                    </span>
                                </ng-template>
                            </p-inplace>
                        </div>
                        <textarea type="text" pTextarea name="taskContent" [(ngModel)]="taskContent" style="resize: none" class="w-full mt-6 mb-6" placeholder="Add a task" (keydown.enter)="addTask($event)"></textarea>

                        <ul *ngIf="formValue.taskList?.tasks?.length !== 0" class="list-none p-6 flex flex-col gap-4 bg-surface-50 dark:bg-surface-950 border-surface border rounded-border">
                            <li class="flex items-center gap-4" *ngFor="let task of formValue.taskList?.tasks; let i = index">
                                <p-checkbox [name]="task.text + i" [(ngModel)]="task.completed" [binary]="true" [inputId]="task.text" (onChange)="calculateProgress()"></p-checkbox>
                                <span style="word-break: break-all;" [ngClass]="{ 'text-600 line-through': task.completed, 'text-900': !task.completed }">
                                    {{ task.text }}
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div class="col-span-12 flex flex-col field px-8">
                        <label for="assignees" class="block text-surface-900 dark:text-surface-0 font-semibold mb-4 text-lg">Assignees</label>
                        <p-autocomplete
                            [appendTo]="sidebar"
                            name="assignees"
                            [(ngModel)]="formValue.assignees"
                            [suggestions]="filteredAssignees"
                            (completeMethod)="filterAssignees($event)"
                            field="name"
                            [multiple]="true"
                            [showEmptyMessage]="true"
                            emptyMessage="No results found"
                            placeholder="Choose assignees"
                            [inputStyle]="{ height: '2.5rem' }"
                            styleClass="w-full"
                            inputStyleClass="w-full"
                        >
                            <ng-template let-assignee #selecteditem>
                                <div class="flex items-center gap-2 border rounded-full dark:!border-gray-600 p-2">
                                    <div class="flex gap-2 items-center">
                                        <img src="/demo/images/avatar/{{ assignee.image }}" [alt]="assignee.name" class="h-8 w-8 border-2 rounded-full border-surface" />
                                        <span class="text-surface-900 dark:text-surface-0">{{ assignee.name }}</span>
                                    </div>
                                </div>
                            </ng-template>
                            <ng-template let-assignee #item>
                                <div class="flex items-center gap-2 rounded-border">
                                    <img src="/demo/images/avatar/{{ assignee.image }}" [alt]="assignee.name" class="h-8 w-8 border-2 rounded-full border-surface" />
                                    <span class="text-surface-900 dark:text-surface-0">{{ assignee.name }}</span>
                                </div>
                            </ng-template>
                        </p-autocomplete>
                    </div>

                    <div class="col-span-12 flex flex-col gap-y-6 px-8 mb-12">
                        <span class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Comments</span>
                        <div class="flex items-center">
                            <span class="w-[3.5rem] h-[3.25rem] rounded-full flex items-center justify-center mr-4 bg-surface-200 dark:bg-surface-800">
                                <i class="pi pi-user"></i>
                            </span>
                            <span></span>
                            <textarea type="text" pTextarea name="comment" [(ngModel)]="comment" style="resize: none" class="w-full" placeholder="Write a comment..." (keydown.enter)="onComment($event)"></textarea>
                        </div>
                        <div *ngFor="let comment of formValue.comments" class="flex items-center rounded-border">
                            <span *ngIf="comment.image" class="w-[3.5rem] h-[3.25rem] rounded-full flex items-center justify-center">
                                <img src="/demo/images/avatar/{{ comment.image }}" />
                            </span>
                            <span *ngIf="!comment.image" class="w-[3.5rem] h-[3.25rem] rounded-full flex items-center justify-center bg-surface-200 dark:bg-surface-800">
                                <i class="pi pi-user"></i>
                            </span>
                            <div class="ml-4 w-full">
                                <div class="flex justify-between mb-2">
                                    <span class="block text-surface-900 dark:text-surface-0">{{ comment.name }}</span>
                                    <span class="block text-surface-700 dark:text-surface-100">1 Jun 17:58 pm</span>
                                </div>
                                <span class="block text-surface-900 dark:text-surface-0 border bg-surface-50 dark:bg-surface-950 border-surface p-2 rounded-border" style="word-break: break-all;">{{ comment?.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex w-full justify-end border-t border-surface py-8 px-8 gap-4">
                    <button pButton pRipple type="button" icon="pi pi-paperclip" class="p-button-outlined p-button-secondary border-surface text-surface-900 dark:text-surface-0 w-12 h-12"></button>
                    <button pButton pRipple type="button" icon="pi pi-trash" class="p-button-outlined p-button-secondary border-surface text-surface-900 dark:text-surface-0 w-12 h-12" (click)="onDelete()"></button>
                    <button pButton pRipple type="submit" icon="pi pi-check" label="Save" class="p-button-primary h-12"></button>
                </div>
            </form>
        </ng-template>
    </p-drawer>`,
    styles: `
        :host ::ng-deep {
            .p-drawer {
                .p-drawer-content {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    overflow: auto;
                }
            }
            .p-autocomplete {
                .p-autocomplete-chip-item {
                    display: flex;
                }
            }

            div.p-inplace-display {
                padding-left: 0 !important;
            }
        }
    `
})
export class KanbanSidebar {
    card: KanbanCardType = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };

    formValue!: KanbanCardType;

    listId: string = '';

    filteredAssignees: Member[] = [];

    assignees: Member[] = [];

    newComment: Comment = { id: '123', name: 'Jane Cooper', text: '' };

    newTask: Task = { text: '', completed: false };

    comment: string = '';

    taskContent: string = '';

    timeout: any = null;

    showTaskContainer: boolean = false;

    listNames: ListName[] = [];

    cardSubscription: Subscription;

    listSubscription: Subscription;

    listNameSubscription: Subscription;

    @ViewChild('inputTitle') inputTitle!: ElementRef;

    @ViewChild('inputTaskListTitle') inputTaskListTitle!: ElementRef;

    constructor(
        public parent: Kanban,
        private memberService: MemberService,
        private kanbanService: KanbanService
    ) {
        this.memberService.getMembers().then((members) => (this.assignees = members));

        this.cardSubscription = this.kanbanService.selectedCard$.subscribe((data) => {
            this.card = data;
            this.formValue = { ...data };
        });
        this.listSubscription = this.kanbanService.selectedListId$.subscribe((data) => (this.listId = data));
        this.listNameSubscription = this.kanbanService.listNames$.subscribe((data) => (this.listNames = data));
    }

    ngOnDestroy() {
        this.cardSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
        this.listNameSubscription.unsubscribe();
        clearTimeout(this.timeout);
    }

    close() {
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    filterAssignees(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.assignees.length; i++) {
            let assignee = this.assignees[i];
            if (assignee.name && assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(assignee);
            }
        }

        this.filteredAssignees = filtered;
    }

    onComment(event: Event) {
        event.preventDefault();
        if (this.comment.trim().length > 0) {
            this.newComment = { ...this.newComment, text: this.comment };
            this.formValue?.comments?.unshift(this.newComment);
            this.comment = '';
        }
    }

    onSave(event: any) {
        event.preventDefault();
        this.card = { ...this.formValue };
        this.kanbanService.updateCard(this.card, this.listId);
        this.close();
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.formValue, listId, this.listId);
    }

    onDelete() {
        this.kanbanService.deleteCard(this.formValue?.id || '', this.listId);
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    resetForm() {
        this.formValue = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };
    }

    addTaskList() {
        this.showTaskContainer = !this.showTaskContainer;

        if (!this.showTaskContainer) {
            return;
        } else if (!this.formValue.taskList) {
            let id = this.kanbanService.generateId();
            this.formValue = { ...this.formValue, taskList: { id: id, title: 'Untitled Task List', tasks: [] } };
        }
    }

    addTask(event: Event) {
        event.preventDefault();
        if (this.taskContent.trim().length > 0) {
            this.newTask = { text: this.taskContent, completed: false };
            this.formValue.taskList?.tasks.unshift(this.newTask);
            this.taskContent = '';
            this.calculateProgress();
        }
    }

    focus(arg: number) {
        if (arg == 1) {
            this.timeout = setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
        }
        if (arg == 2) {
            this.timeout = setTimeout(() => this.inputTaskListTitle.nativeElement.focus(), 1);
        }
    }

    calculateProgress() {
        if (this.formValue.taskList) {
            let completed = this.formValue.taskList.tasks.filter((t) => t.completed).length;
            this.formValue.progress = Math.round(100 * (completed / this.formValue.taskList.tasks.length));
        }
    }
}
