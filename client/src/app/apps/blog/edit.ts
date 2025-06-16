import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FileUploadModule } from 'primeng/fileupload';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import {MessageService} from "primeng/api";
import {PrimeNG} from "primeng/config";
import {BadgeModule} from "primeng/badge";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [FileUploadModule, ChipModule, InputTextModule, TextareaModule, ButtonModule, CommonModule, FluidModule, EditorModule, BadgeModule, ProgressBarModule],
    template: `<div class="card">
        <span class="block text-surface-900 dark:text-surface-0 font-bold text-xl mb-6">Create a new post</span>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-8">
                <p-fileupload #uploader name="myfile[]" url="https://www.primefaces.org/cdn/api/upload.php" [multiple]="true" accept="image/*" maxFileSize="1000000" (onUpload)="onTemplatedUpload()" (onSelect)="onSelectedFiles($event)">
                    <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-uploadCallback="uploadCallback">
                        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                            <div class="flex gap-2">
                                <p-button (onClick)="choose($event, chooseCallback)" icon="pi pi-images" [rounded]="true" [outlined]="true" />
                                <p-button (onClick)="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" [rounded]="true" [outlined]="true" severity="success" [disabled]="!files || files.length === 0" />
                                <p-button (onClick)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" />
                            </div>
                        </div>
                    </ng-template>
                    <ng-template #content let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback" let-removeUploadedFileCallback="removeUploadedFileCallback">
                        <div class="flex flex-col gap-8 pt-4">
                            <div *ngIf="files?.length > 0">
                                <div class="flex flex-wrap gap-4">
                                    <div *ngFor="let file of files; let i = index" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                        </div>
                                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                        <div>{{ formatSize(file.size) }}</div>
                                        <p-badge value="Pending" severity="warn" />
                                        <p-button icon="pi pi-times" (click)="onRemoveTemplatingFile($event, file, removeFileCallback, i)" [outlined]="true" [rounded]="true" severity="danger" />
                                    </div>
                                </div>
                            </div>
                            <div *ngIf="uploadedFiles?.length > 0">
                                <h5>Completed</h5>
                                <div class="flex flex-wrap gap-4">
                                    <div *ngFor="let file of uploadedFiles; let i = index" class="card m-0 px-12 flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" />
                                        </div>
                                        <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                        <div>{{ formatSize(file.size) }}</div>
                                        <p-badge value="Completed" class="mt-4" severity="success" />
                                        <p-button icon="pi pi-times" (onClick)="removeUploadedFileCallback(i)" [outlined]="true" [rounded]="true" severity="danger" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ng-template>
                    <ng-template #file></ng-template>
                    <ng-template #empty>
                        <div class="flex items-center justify-center flex-col" (click)="uploader.choose()">
                            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color"></i>
                            <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                        </div>
                    </ng-template>
                </p-fileupload>
                <p-fluid class="flex flex-col">
                    <div class="mb-6 mt-4">
                        <input pInputText type="text" placeholder="Title" />
                    </div>
                    <div class="mb-6">
                        <textarea pTextarea rows="6" placeholder="Content" autoResize></textarea>
                    </div>

                    <p-editor [style]="{ height: '320px' }"></p-editor>
                </p-fluid>
            </div>
            <div class="col-span-12 lg:col-span-4">
                <div class="border border-surface-200 dark:border-surface-700 rounded mb-6">
                    <span class="text-surface-900 dark:text-surface-0 font-bold block border-b border-surface-200 dark:border-surface-700 p-4">Publish</span>
                    <div class="p-4">
                        <div class="bg-surface-100 dark:bg-surface-700 p-4 flex items-center rounded">
                            <span class="text-surface-900 dark:text-surface-0 font-semibold mr-4">Status:</span>
                            <span class="font-medium">Draft</span>
                            <p-button type="button" icon="pi pi-fw pi-pencil" class="ml-auto" text rounded></p-button>
                        </div>
                    </div>
                    <div class="p-4">
                        <div class="bg-surface-100 dark:bg-surface-700 p-4 flex items-center rounded">
                            <span class="text-surface-900 dark:text-surface-0 font-semibold mr-4">Visibility:</span>
                            <span class="font-medium">Private</span>
                            <p-button type="button" icon="pi pi-fw pi-pencil" class="ml-auto" text rounded></p-button>
                        </div>
                    </div>
                </div>
                <div class="border border-surface-200 dark:border-surface-700 rounded mb-6">
                    <span class="text-surface-900 dark:text-surface-0 font-bold block border-b border-surface-200 dark:border-surface-700 p-4">Tags</span>
                    <div class="p-4 flex gap-2">
                        <p-chip *ngFor="let tag of tags; let i = index" [label]="tag" [attr.key]="i"></p-chip>
                    </div>
                </div>
                <p-fluid>
                    <div class="border border-surface-200 dark:border-surface-700 rounded mb-6">
                        <span class="text-surface-900 dark:text-surface-0 font-bold block border-b border-surface-200 dark:border-surface-700 p-4">Meta</span>
                        <div class="p-4">
                            <div class="mb-6">
                                <input pInputText type="text" placeholder="Title" />
                            </div>
                            <div>
                                <textarea pTextarea rows="6" placeholder="Description" autoResize></textarea>
                            </div>
                        </div>
                    </div>
                </p-fluid>
                <div class="flex justify-between gap-4">
                    <p-button class="flex-1" styleClass="w-full" severity="danger" outlined label="Discard" icon="pi pi-fw pi-trash"></p-button>
                    <p-button class="flex-1" styleClass="w-full" label="Publish" icon="pi pi-fw pi-check"></p-button>
                </div>
            </div>
        </div>
    </div> `,
    providers: [MessageService]
})
export class Edit {
    tags: string[] = ['Software', 'Web'];

    files = [];

    totalSize : number = 0;

    totalSizePercent : number = 0;

    constructor(private config: PrimeNG, private messageService: MessageService) {}

    choose(event: any, callback: any) {
        callback();
    }

    onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: number) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }


    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event: any) {
        this.files = event.currentFiles;
        this.files.forEach((file: any) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback: any) {
        callback();
    }

    formatSize(bytes: number) {
        const k = 1024;
        const dm = 3;
        const sizes = <any>this.config.translation.fileSizeTypes;
        if (bytes === 0) {
            return `0 ${sizes[0]}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    }
}
