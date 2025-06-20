import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Menu, MenuModule} from 'primeng/menu';
import {TaskService} from './service/task.service';
import {CommonModule} from '@angular/common';
import {CheckboxModule} from 'primeng/checkbox';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {FormsModule} from '@angular/forms';
import {Task} from '@/types/task';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [CommonModule, CheckboxModule, AvatarGroupModule, AvatarModule, MenuModule, ButtonModule, RippleModule, FormsModule],
    template: `<div>
        <div class="text-surface-900 dark:text-surface-0 font-semibold text-lg mt-8 mb-4 border-b border-surface-200 dark:border-surface-700 py-4">
            {{ title }}
        </div>
        <ul class="list-none p-0 m-0">
            <li *ngFor="let task of taskList" class="flex flex-col gap-4 md:flex-row md:items-center p-2 border-b border-surface-200 dark:border-surface-700">
                <div class="flex items-center flex-1">
                    <p-checkbox [binary]="true" (onChange)="onCheckboxChange($event, task)" [(ngModel)]="task.completed" [inputId]="task.id.toString()"></p-checkbox>
                    <label for="task.id" style="word-break: break-word;" class="font-medium whitespace-nowrap text-ellipsis overflow-hidden ml-2" [ngClass]="{ 'line-through': task.completed }" style="max-width: 500px">{{ task.name }}</label>
                </div>
                <div class="flex flex-1 gap-4 flex-col sm:flex-row sm:justify-between">
                    <div class="flex items-center">
                        <span *ngIf="task.comments" class="flex items-center font-semibold mr-4"><i class="pi pi-comment mr-2"></i>{{ task.comments }}</span>
                        <span *ngIf="task.attachments" class="flex items-center font-semibold mr-4"><i class="pi pi-paperclip mr-2"></i>{{ task.attachments }}</span>
                        <span class="flex items-center font-semibold whitespace-nowrap" *ngIf="task.startDate"><i class="pi pi-clock mr-2"></i>{{ parseDate(task.startDate) }}</span>
                    </div>
                    <div class="flex items-center sm:justify-end">
                        <p-avatarGroup styleClass="mr-4">
                            <p-avatar *ngFor="let member of task.members | slice: 0 : 4" image="/demo/images/avatar/{{ member.image }}" size="large" shape="circle"></p-avatar>
                            <p-avatar
                                *ngIf="task && task.members && task.members.length > 4"
                                label="+ {{ task.members.length - 4 }}"
                                shape="circle"
                                size="large"
                                class="bg-blue-500"
                                [style]="{
                                    color: '#212121',
                                    border: '2px solid var(--surface-border)'
                                }"
                            ></p-avatar>
                        </p-avatarGroup>
                        <button pButton pRipple type="button" icon="pi pi-ellipsis-v" class="z-30 ml-auto sm:ml-0" text rounded (click)="toggleMenu($event, task)"></button>
                        <p-menu #menu [popup]="true" [model]="menuItems" styleClass="w-32" ></p-menu>
                    </div>
                </div>
            </li>
        </ul>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
    @Input() taskList!: Task[];

    @Input() title!: string;

    @ViewChild('menu') menu!: Menu;

    menuItems: MenuItem[] = [];

    clickedTask!: Task;

    constructor(private taskService: TaskService) {}

    ngOnInit(): void {
        this.menuItems = [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.onEdit()
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => this.handleDelete()
            }
        ];
    }

    parseDate(date: Date) {
        let d = new Date(date);
        return d.toUTCString().split(' ').slice(1, 3).join(' ');
    }

    handleDelete() {
        this.taskService.removeTask(this.clickedTask.id);
    }

    toggleMenu(event: Event, task: Task) {
        this.clickedTask = task;
        this.menu.toggle(event);
    }

    onEdit() {
        this.taskService.onTaskSelect(this.clickedTask);
        this.taskService.showDialog('Edit Task', false);
    }

    onCheckboxChange(event: any, task: Task) {
        event.originalEvent.stopPropagation();
        task.completed = event.checked;
        this.taskService.markAsCompleted(task);
    }
}
