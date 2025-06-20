import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TaskService } from './service/task.service';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MemberService } from '@/pages/service/member.service';
import { DialogConfig, Member, Task } from '@/types/task';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-create-task',
    standalone: true,
    imports: [ToastModule, DialogModule, FormsModule, EditorModule, DatePickerModule, ButtonModule, AutoCompleteModule, FluidModule, InputTextModule, Ripple],
    template: `<p-toast></p-toast>
        <p-dialog
            [header]="dialogConfig.header || ''"
            [(visible)]="dialogConfig.visible"
            [modal]="true"
            [dismissableMask]="true"
            styleClass="mx-4 sm:mx-0 sm:w-full md:w-8/12 lg:w-6/12"
            contentStyleClass="rounded-b border-t border-surface-200 dark:border-surface-700 p-0"
        >
            <div class="p-6">
                <p-fluid class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <label for="name" class="text-surface-900 dark:text-surface-0 font-semibold block mb-2">Task Name</label>
                        <input id="name" type="text" placeholder="Title" pInputText [(ngModel)]="task.name" />
                    </div>
                    <div class="col-span-12">
                        <label for="description" class="text-surface-900 dark:text-surface-0 font-semibold block mb-2">Description</label>
                        <p-editor [(ngModel)]="task.description" [style]="{ height: '150px' }"></p-editor>
                    </div>
                    <div class="col-span-6">
                        <label for="start" class="text-surface-900 dark:text-surface-0 font-semibold block mb-2">Start Date</label>
                        <p-datepicker appendTo="body" dateFormat="yy-mm-dd" [showTime]="false" inputId="start" placeholder="Start Date" [(ngModel)]="task.startDate"></p-datepicker>
                    </div>
                    <div class="col-span-6">
                        <label for="end" class="text-surface-900 dark:text-surface-0 font-semibold block mb-2">Due Date</label>
                        <p-datepicker appendTo="body" dateFormat="yy-mm-dd" [showTime]="false" inputId="end" placeholder="Due Date" [(ngModel)]="task.endDate"></p-datepicker>
                    </div>
                    <div class="col-span-12">
                        <label for="members" class="text-surface-900 dark:text-surface-0 font-semibold block mb-2">Add Team Member</label>
                        <p-autocomplete
                            appendTo="body"
                            inputId="members"
                            [(ngModel)]="task.members"
                            [suggestions]="filteredMembers"
                            (completeMethod)="filterMembers($event)"
                            field="name"
                            [multiple]="true"
                            placeholder="Choose team members"
                            [inputStyle]="{ height: '2.5rem' }"
                        >
                            <ng-template let-member pTemplate="selectedItem">
                                <div class="flex items-center">
                                    <img src="/demo/images/avatar/{{ member.image }}" [alt]="member.name" class="h-8 w-8 mr-2" />
                                    <span class="text-surface-900 dark:text-surface-0 font-medium">{{ member.name }}</span>
                                </div>
                            </ng-template>
                            <ng-template let-member pTemplate="item">
                                <div class="flex items-center">
                                    <img src="/demo/images/avatar/{{ member.image }}" [alt]="member.name" class="h-8 w-8 mr-2" />
                                    <span class="text-surface-900 dark:text-surface-0 font-medium">{{ member.name }}</span>
                                </div>
                            </ng-template>
                        </p-autocomplete>
                    </div>
                    <div class="col-span-12 flex justify-end mt-6">
                        <button pButton pRipple class="w-32 mr-4" outlined icon="pi pi-times" label="Cancel" (click)="cancelTask()"></button>
                        <button pButton pRipple class="w-32" icon="pi pi-check" label="Save" (click)="save()"></button>
                    </div>
                </p-fluid>
            </div>
        </p-dialog>`,
    providers: [MessageService]
})
export class CreateTaskComponent implements OnInit, OnDestroy {
    task!: Task;

    members: Member[] = [];

    filteredMembers: Member[] = [];

    dialogConfig: DialogConfig = { header: '', visible: false };

    subscription: Subscription;

    dialogSubscription: Subscription;

    constructor(
        private memberService: MemberService,
        private messageService: MessageService,
        private taskService: TaskService
    ) {
        this.subscription = this.taskService.selectedTask$.subscribe((data) => (this.task = data));
        this.dialogSubscription = this.taskService.dialogSource$.subscribe((data) => {
            this.dialogConfig = data;

            if (this.dialogConfig.newTask) {
                this.resetTask();
            }
        });
    }

    ngOnInit(): void {
        this.memberService.getMembers().then((members) => (this.members = members));
        this.resetTask();
    }

    filterMembers(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            if (member.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(member);
            }
        }

        this.filteredMembers = filtered;
    }

    save() {
        this.task.id = Math.floor(Math.random() * 1000);
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Task "${this.task.name}" created successfully.`
        });
        this.taskService.addTask(this.task);
        this.taskService.closeDialog();
    }

    cancelTask() {
        this.resetTask();
        this.taskService.closeDialog();
    }

    resetTask() {
        this.task = {
            id: this.task && this.task.id ? this.task.id : Math.floor(Math.random() * 1000),
            status: 'Waiting'
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
