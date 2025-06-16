import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Subscription } from 'rxjs';
import { FileAppService } from '@/apps/files/service/file.service';
import { UploaderComponent } from '@/apps/files/uploader/uploader';
import { LayoutService } from '@/layout/service/layout.service';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule, ChartModule, TableModule, UploaderComponent, Ripple],
    template: `<div class="grid grid-cols-12 gap-4">
        <div *ngFor="let metric of metrics" class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="card h-full">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-surface-900 dark:text-surface-0 text-xl font-semibold">{{ metric.title }}</span>
                    <div>
                        <button pButton pRipple [icon]="metric.icon" text rounded size="small" (click)="menu.toggle($event)"></button>
                        <p-menu #menu [popup]="true" appendTo="body" [model]="menuitems"></p-menu>
                    </div>
                </div>
                <div>
                    <div [ngClass]="metric.color" class="rounded" style="height: 6px">
                        <div [ngClass]="metric.fieldColor" class="!h-full rounded" style="width:34%"></div>
                    </div>
                    <div class="flex align-item-center justify-between">
                        <span class="text-surface-900 dark:text-surface-0 mt-4 text-md font-medium">{{ metric.files }}</span>
                        <span class="text-surface-900 dark:text-surface-0 mt-4 text-md font-medium">{{ metric.fileSize }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-span-12 md:col-span-5 xl:col-span-3">
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Account Storage</div>
                <div class="flex flex-row justify-center" style="height: 200px">
                    <p-chart type="doughnut" [plugins]="chartPlugins" id="country-chart" [data]="fileChart" [options]="fileChartOptions" [style]="{ width: '200px' }"></p-chart>
                </div>

                <div class="mt-8 flex gap-4">
                    <button pButton pRipple icon="pi pi-search" outlined class="flex-1" label="Details"></button>
                    <button pButton pRipple icon="pi pi-upload" class="flex-1" label="Upgrade"></button>
                </div>
            </div>

            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Categories</div>
                <ul class="list-none p-0 m-0">
                    <li class="p-4 mb-4 flex items-center justify-between cursor-pointer rounded bg-indigo-50 text-indigo-900">
                        <div class="flex items-center">
                            <i class="pi pi-image text-2xl mr-4"></i>
                            <span class="text-lg font-medium">Images</span>
                        </div>
                        <span class="text-lg font-bold">85</span>
                    </li>
                    <li class="p-4 mb-4 flex items-center justify-between cursor-pointer rounded bg-purple-50 text-purple-900">
                        <div class="flex items-center">
                            <i class="pi pi-file text-2xl mr-4"></i>
                            <span class="text-lg font-medium">Documents</span>
                        </div>
                        <span class="text-lg font-bold">231</span>
                    </li>
                    <li class="p-4 flex items-center justify-between cursor-pointer rounded bg-teal-50 text-teal-900">
                        <div class="flex items-center">
                            <i class="pi pi-video text-2xl mr-4"></i>
                            <span class="text-lg font-medium">Videos</span>
                        </div>
                        <span class="text-lg font-bold">40</span>
                    </li>
                </ul>
            </div>

            <div class="card !p-0">
                <app-file-uploader></app-file-uploader>
            </div>
        </div>
        <div class="col-span-12 md:col-span-7 xl:col-span-9">
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Folders</div>
                <div class="grid grid-cols-12 gap-4">
                    <div *ngFor="let folder of folders" class="col-span-12 md:col-span-6 xl:col-span-4">
                        <div class="p-4 border border-surface-200 dark:border-surface-700 flex items-center justify-between hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded">
                            <div class="flex items-center">
                                <i [ngClass]="folder.icon" class="text-2xl mr-4"></i>
                                <span class="text-surface-900 dark:text-surface-0 text-lg font-medium">{{ folder.name }}</span>
                            </div>
                            <span class="text-surface-600 dark:text-surface-200 text-lg font-semibold">{{ folder.size }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Recent Uploads</div>
                <p-table responsiveLayout="scroll" #dt [value]="files" [rows]="8" [paginator]="true">
                    <ng-template pTemplate="header">
                        <tr>
                            <th pSortableColumn="name" style="min-width:12rem" class="white-space-nowrap"><span class="flex items-center gap-2">Name <p-sortIcon field="name"></p-sortIcon></span></th>
                            <th pSortableColumn="date" style="min-width:12rem" class="white-space-nowrap"><span class="flex items-center gap-2">Date <p-sortIcon field="date"></p-sortIcon></span></th>
                            <th pSortableColumn="fileSize" style="min-width:12rem" class="white-space-nowrap">
                                <span class="flex items-center gap-2">File Size
                                    <p-sortIcon field="fileSize"></p-sortIcon></span>
                            </th>
                            <th style="width:10rem"></th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-file>
                        <tr>
                            <td>
                                <div class="flex items-center">
                                    <i [class]="'text-xl text-primary mr-2 ' + file.icon"></i>
                                    <span>{{ file.name }}</span>
                                </div>
                            </td>
                            <td>
                                <span>{{ file.date }}</span>
                            </td>
                            <td>
                                <span>{{ file.fileSize }}</span>
                            </td>
                            <td class="text-center">
                                <button pButton pRipple text rounded icon="pi pi-times" severity="danger" class="mr-2"></button>
                                <button pButton pRipple text rounded icon="pi pi-search"></button>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    </div> `,
    providers: [FileAppService]
})
export class Files {
    fileChart: any;

    fileChartOptions: any;

    chartPlugins: any;

    files: File[] = [];

    metrics: any[] = [];

    folders: any[] = [];

    menuitems: MenuItem[] = [];

    subscription: Subscription;

    constructor(
        private fileService: FileAppService,
        private layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.fileService.getFiles().then((data) => (this.files = data));
        this.fileService.getMetrics().then((data) => (this.metrics = data));
        this.fileService.getFoldersLarge().then((data) => (this.folders = data));

        this.initChart();

        this.menuitems = [
            { label: 'View', icon: 'pi pi-search' },
            { label: 'Refresh', icon: 'pi pi-refresh' }
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.chartPlugins = [
            {
                beforeDraw: function (chart: any) {
                    let ctx = chart.ctx;
                    let width = chart.width;
                    let height = chart.height;
                    let fontSize = 1.5;
                    let oldFill = ctx.fillStyle;

                    ctx.restore();
                    ctx.font = fontSize + 'rem sans-serif';
                    ctx.textBaseline = 'middle';

                    let text = 'Free Space';
                    let text2 = 50 + 'GB / ' + 80 + 'GB';
                    let textX = Math.round((width - ctx.measureText(text).width) / 2);
                    let textY = (height + chart.chartArea.top) / 2.25;

                    let text2X = Math.round((width - ctx.measureText(text).width) / 2.1);
                    let text2Y = (height + chart.chartArea.top) / 1.75;

                    ctx.fillStyle = chart.config.data.datasets[0].backgroundColor[0];
                    ctx.fillText(text, textX, textY);
                    ctx.fillText(text2, text2X, text2Y);
                    ctx.fillStyle = oldFill;
                    ctx.save();
                }
            }
        ];

        this.fileChart = {
            datasets: [
                {
                    data: [300, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--p-primary-600'), documentStyle.getPropertyValue('--p-primary-100')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--p-primary-700'), documentStyle.getPropertyValue('--p-primary-200')],
                    borderColor: 'transparent',
                    fill: true
                }
            ]
        };

        this.fileChartOptions = {
            animation: {
                duration: 0
            },
            cutout: '90%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
    }
}
