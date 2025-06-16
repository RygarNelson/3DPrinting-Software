import { Component, OnDestroy } from '@angular/core';

import { TaskService } from './service/task.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TaskListComponent } from './task-list';
import { CreateTaskComponent } from './create-task';
import { Task } from '@/types/task';
import { RippleModule } from 'primeng/ripple';

@Component({
    standalone: true,
    imports: [ButtonModule, TaskListComponent, CreateTaskComponent, RippleModule],
    template: `<div class="card">
            <div class="flex justify-between items-center mb-8">
                <span class="text-surface-900 dark:text-surface-0 text-xl font-semibold">Task List</span>
                <button pButton pRipple class="font-semibold" outlined icon="pi pi-plus" label="Create Task" (click)="showDialog()"></button>
            </div>
            <app-task-list [taskList]="todo" title="ToDo"></app-task-list>
            <app-task-list [taskList]="completed" title="Completed"></app-task-list>
        </div>

        <app-create-task></app-create-task>`,
    providers: [TaskService]
})
export class TaskList implements OnDestroy {
    subscription: Subscription;

    todo: Task[] = [];

    completed: Task[] = [];

    constructor(private taskService: TaskService) {
        this.subscription = this.taskService.taskSource$.subscribe((data) => this.categorize(data));
    }

    categorize(tasks: Task[]) {
        this.todo = tasks.filter((t) => t.completed !== true);
        this.completed = tasks.filter((t) => t.completed);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.taskService.showDialog('Create Task', true);
    }
}
