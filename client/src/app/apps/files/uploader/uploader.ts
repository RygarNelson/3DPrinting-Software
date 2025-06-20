import {CommonModule} from '@angular/common';
import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import {MessageService} from 'primeng/api';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';
import {ButtonDirective, ButtonIcon} from 'primeng/button';
import {Ripple} from 'primeng/ripple';

interface Image {
    name: string;
    objectURL: string;
}

@Component({
    selector: 'app-file-uploader',
    standalone: true,
    imports: [ToastModule, FileUploadModule, CommonModule, ButtonDirective, Ripple, ButtonIcon],
    template: `<p-toast key="fu"></p-toast>
        <div class="card">
            <p-fileupload
                #fileUploader
                name="demo[]"
                url="https://www.primefaces.org/cdn/api/upload.php"
                accept="image/*"
                (onUpload)="onUpload($event)"
                [customUpload]="true"
                [multiple]="true"
                (onSelect)="onUpload($event)"
                [showUploadButton]="true"
                [showCancelButton]="false"
                [auto]="true"
                class="upload-button-hidden w-full"
            >
                <ng-template #content>
                    <div class="w-full py-4" style="cursor: copy" (click)="fileUploader.advancedFileInput.nativeElement.click()">
                        <div *ngIf="!uploadedFiles.length" class="h-full flex flex-col justify-center items-center">
                            <i class="pi pi-upload text-surface-900 dark:text-surface-0 text-2xl mb-4"></i>
                            <span class="font-bold text-surface-900 dark:text-surface-0 text-xl mb-4">Upload Files</span>
                            <span class="font-medium text-surface-600 dark:text-surface-200 text-md text-center">Drop or select files</span>
                        </div>
                        <div class="w-full py-4" *ngIf="uploadedFiles.length" [style]="{ cursor: 'copy' }">
                            <div *ngFor="let file of uploadedFiles; let i = index" class="flex flex-wrap gap-8" (mouseenter)="onImageMouseOver(file)" (mouseleave)="onImageMouseLeave(file)" style="padding: 1px;">
                                <div class="remove-file-wrapper relative w-28 h-28 border-4 border-transparent rounded hover:bg-primary hover:text-primary-contrast duration-100 cursor-auto" [style]="{ padding: '1px' }">
                                    <img [src]="file.objectURL" [alt]="file.name" class="w-full h-full rounded shadow" />
                                    <button
                                        [id]="file.name"
                                        #buttonEl
                                        pButton
                                        pRipple
                                        rounded
                                        type="button"
                                        class="remove-button text-sm absolute justify-center items-center cursor-pointer"
                                        style="top: -10px; right: -10px; display: none;"
                                        (click)="removeImage($event, file)"
                                    >
                                        <i pButtonIcon class="pi pi-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-fileupload>
        </div>`,
    providers: [MessageService],
    styles: `
        :host ::ng-deep .p-fileupload-header {
            display: none;
        }

        :host ::ng-deep .p-fileupload {
            border: none;
        }

        :host ::ng-deep .p-fileupload-file-list {
            display: none;
        }
    `
})
export class UploaderComponent {
    uploadedFiles: any[] = [];

    @ViewChildren('buttonEl') buttonEl!: QueryList<ElementRef>;

    constructor(private messageService: MessageService) {}

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File uploaded successfully'
        });
    }

    onImageMouseOver(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name ? (el.nativeElement.style.display = 'flex') : null;
        });
    }

    onImageMouseLeave(file: Image) {
        this.buttonEl.toArray().forEach((el) => {
            el.nativeElement.id === file.name ? (el.nativeElement.style.display = 'none') : null;
        });
    }

    removeImage(event: Event, file: any) {
        event.stopPropagation();
        this.uploadedFiles = this.uploadedFiles.filter((i) => i !== file);
    }
}
