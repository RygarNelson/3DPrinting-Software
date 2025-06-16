import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [CommonModule, FormsModule, DataViewModule, SelectModule, AvatarModule],
    template: ` <div class="card">
            <p-dataview [value]="totalBlogs" paginator [rows]="3" layout="grid" [sortOrder]="sortOrder" [sortField]="sortField">
                <ng-template #header>
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <span class="text-xl text-surface-900 dark:text-surface-0 font-semibold">Articles</span>
                        <p-select [(ngModel)]="sortKey" [options]="sortOptions" optionLabel="label" optionValue="value" placeholder="Sort By" class="w-full md:w-60" (onChange)="onSortChange($event)" />
                    </div>
                </ng-template>
                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4 grid-nogutter">
                        <div *ngFor="let item of items" class="col-span-12 md:col-span-4">
                            <div class="p-4">
                                <div class="bg-surface-100 dark:bg-surface-700 cursor-pointer z-index rounded">
                                    <div class="relative">
                                        <img [src]="item.coverImage" class="w-full" [alt]="item.description.split(' ', 1)" />
                                        <img
                                            [src]="item.profile"
                                            class="flex absolute w-16 h-16"
                                            [style]="{
                                                bottom: '-1.5rem',
                                                right: '1.5rem'
                                            }"
                                            [alt]="item.description.split(' ', 1)"
                                        />
                                    </div>
                                    <div class="p-4">
                                        <div class="text-surface-900 dark:text-surface-0 font-semibold text-xl mb-4">
                                            {{ item.title }}
                                        </div>
                                        <p class="text-surface-700 dark:text-surface-100 text-lg mt-0 mb-8">
                                            {{ item.description }}
                                        </p>
                                        <div class="flex flex-wrap gap-2 items-center justify-between">
                                            <span class="flex items-center text-surface-900 dark:text-surface-0">
                                                <i class="pi pi-comment mr-2"></i>
                                                <span class="font-semibold">{{ item.comment }}</span>
                                            </span>
                                            <span class="flex items-center text-surface-900 dark:text-surface-0">
                                                <i class="pi pi-share-alt mr-2"></i>
                                                <span class="font-semibold">{{ item.share }}</span>
                                            </span>
                                            <span class="flex items-center text-surface-900 dark:text-surface-0">
                                                <i class="pi pi-clock mr-2"></i>
                                                <span class="font-semibold mr-1">{{ item.day }}</span>
                                                <span class="font-semibold">{{ item.month }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
        </div>

        <div class="card">
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="font-bold text-5xl text-surface-900 dark:text-surface-0 mb-4">Recent Articles</div>
                <div class="text-surface-700 dark:text-surface-100 text-xl leading-normal mb-8">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                <div class="grid grid-cols-12 gap-4 nogutter">
                    <div class="col-span-12 lg:col-span-4 p-6">
                        <div class="border-t-4 border-blue-600"></div>
                        <div class="text-blue-600 font-medium my-2">Animals</div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-normal mb-6">Why Earth&lsquo;s most beloved creatures are headed toward extinction</div>
                        <div class="font-sm text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                        <div class="flex mt-6">
                            <p-avatar image="/demo/images/avatar/circle/avatar-f-1.png" shape="circle"></p-avatar>
                            <div class="ml-2">
                                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 mb-1">Anna Miles</div>
                                <div class="text-xs flex items-center text-surface-700 dark:text-surface-100">
                                    <i class="pi pi-calendar mr-1 text-xs"></i>
                                    <span>Apr 9, 2021</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4 p-6">
                        <div class="border-t-4 border-pink-600"></div>
                        <div class="text-pink-600 font-medium my-2">Oxygen</div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-normal mb-6">Only one-third of tropical rainforests remain intact, study says</div>
                        <div class="font-sm text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                        <div class="flex mt-6">
                            <p-avatar image="/demo/images/avatar/circle/avatar-f-2.png" shape="circle"></p-avatar>
                            <div class="ml-2">
                                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 mb-1">Arlene Miles</div>
                                <div class="text-xs flex items-center text-surface-700 dark:text-surface-100">
                                    <i class="pi pi-calendar mr-1 text-xs"></i>
                                    <span>Apr 9, 2021</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-4 p-6">
                        <div class="border-t-4 border-orange-600"></div>
                        <div class="text-orange-600 font-medium my-2">Nature</div>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl leading-normal mb-6">Does planting a tree really offset your carbon footprint?</div>
                        <div class="font-sm text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                        <div class="flex mt-6">
                            <p-avatar image="/demo/images/avatar/circle/avatar-f-3.png" shape="circle"></p-avatar>
                            <div class="ml-2">
                                <div class="text-xs font-bold text-surface-900 dark:text-surface-0 mb-1">Diane Miles</div>
                                <div class="text-xs flex items-center text-surface-700 dark:text-surface-100">
                                    <i class="pi pi-calendar mr-1 text-xs"></i>
                                    <span>Apr 9, 2021</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class List {
    sortOptions: any[] = [
        { label: 'Most Shared', value: 'share' },
        { label: 'Most Commented', value: 'comment' }
    ];

    sortOrder: number = -1;

    sortKey = null;

    sortField: string = '';

    totalBlogs: any[] = [
        {
            coverImage: '/demo/images/blog/blog-1.png',
            profile: '/demo/images/avatar/circle/avatar-f-1.png',
            title: 'Blog',
            description: 'Ornare egestas pellentesque facilisis in a ultrices erat diam metus integer sed',
            comment: 2,
            share: 7,
            day: '15',
            month: 'October'
        },
        {
            coverImage: '/demo/images/blog/blog-2.png',
            profile: '/demo/images/avatar/circle/avatar-f-2.png',
            title: 'Magazine',
            description: 'Magna iaculis sagittis, amet faucibus scelerisque non ornare non in penatibus ',
            comment: 5,
            share: 1,
            day: '20',
            month: 'Nov'
        },
        {
            coverImage: '/demo/images/blog/blog-3.png',
            profile: '/demo/images/avatar/circle/avatar-m-1.png',
            title: 'Science',
            description: 'Purus mattis mi, libero maecenas volutpat quis a morbi arcu pharetra, mollis',
            comment: 2,
            share: 6,
            day: '23',
            month: 'Oct'
        },
        {
            coverImage: '/demo/images/blog/blog-4.png',
            profile: '/demo/images/avatar/circle/avatar-m-1.png',
            title: 'Blog',
            description: 'Curabitur vitae sit justo facilisi nec, sodales proin aliquet libero volutpat nunc',
            comment: 5,
            share: 5,
            day: '14',
            month: 'Dec'
        },
        {
            coverImage: '/demo/images/blog/blog-5.png',
            profile: '/demo/images/avatar/circle/avatar-f-3.png',
            title: 'Magazine',
            description: 'Id eget arcu suspendisse ullamcorper dolor lobortis dui et morbi penatibus quam',
            comment: 4,
            share: 1,
            day: '05',
            month: 'Apr'
        },
        {
            coverImage: '/demo/images/blog/blog-6.png',
            profile: '/demo/images/avatar/circle/avatar-m-3.png',
            title: 'Science',
            description: 'Sagittis hendrerit laoreet dignissim sed auctor sit pellentesque vel diam iaculis et',
            comment: 1,
            share: 3,
            day: '12',
            month: 'Nov'
        }
    ];

    onSortChange(event: any) {
        const sortValue = event.value;

        if (sortValue.indexOf('!') === 0) {
            this.sortOrder = 1;
            this.sortField = sortValue.substring(1, sortValue.length);
            this.sortKey = sortValue;
        } else {
            this.sortOrder = -1;
            this.sortField = sortValue;
            this.sortKey = sortValue;
        }
    }
}
