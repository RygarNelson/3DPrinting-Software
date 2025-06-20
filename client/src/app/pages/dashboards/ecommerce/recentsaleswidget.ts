import { Component, ViewChild } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '@/pages/service/product.service'
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputIconModule } from 'primeng/inputicon';
import { FilterMatchMode } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        RippleModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        FormsModule,
        TooltipModule,
        TagModule,
    ],
    template: ` <div class="card">
        <div
            class="flex flex-col md:flex-row md:items-start md:justify-between mb-4"
        >
            <div
                class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4 md:mb-0"
            >
                Recent Sales
            </div>
            <div class="inline-flex items-center">
                <p-iconfield>
                    <p-inputicon class="pi pi-search" />
                    <input
                        pInputText
                        type="text"
                        (input)="onFilterGlobal($event)"
                        placeholder="Search"
                        [style]="{ borderRadius: '2rem' }"
                        class="w-full"
                    />
                </p-iconfield>
                <p-button
                    icon="pi pi-upload"
                    class="mx-4 export-target-button"
                    rounded
                    pTooltip="Export"
                    (click)="dt.exportCSV()"
                />
            </div>
        </div>
        <p-table
            #dt
            [value]="products"
            [paginator]="true"
            [rows]="5"
            [columns]="cols"
            responsiveLayout="scroll"
            [globalFilterFields]="[
                'name',
                'category',
                'price',
                'inventoryStatus',
            ]"
            [exportHeader]="'customExportHeader'"
        >
            <ng-template #header>
                <tr>
                    <th pSortableColumn="name">
                        <span class="flex items-center gap-2">Name <p-sortIcon field="name"></p-sortIcon></span>
                    </th>
                    <th pSortableColumn="category">
                        <span class="flex items-center gap-2">Category <p-sortIcon field="category"></p-sortIcon></span>
                    </th>
                    <th pSortableColumn="price">
                        <span class="flex items-center gap-2">Price <p-sortIcon field="price"></p-sortIcon></span>
                    </th>
                    <th pSortableColumn="status">
                        <span class="flex items-center gap-2">Status <p-sortIcon field="status"></p-sortIcon></span>
                    </th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 35%; min-width: 7rem;">
                        {{ product.name }}
                    </td>
                    <td style="width: 35%; min-width: 7rem;">
                        {{ product.category }}
                    </td>
                    <td style="width: 35%; min-width: 8rem;">
                        {{ product.price | currency: 'USD' }}
                    </td>
                    <td style="width: 35%; min-width: 8rem;">
                        <p-tag
                            [severity]="
                                getBadgeSeverity(product.inventoryStatus)
                            "
                            >{{ product.inventoryStatus }}</p-tag
                        >
                    </td>
                    <td style="width: 15%;">
                        <p-button icon="pi pi-search" outlined rounded />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ProductService],
})
export class RecentSalesWidget {
    products!: Product[];

    filterSalesTable = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    cols!: Column[];

    exportColumns!: ExportColumn[];

    @ViewChild('dt') dt!: Table;

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

        this.cols = [
            {
                field: 'code',
                header: 'Code',
                customExportHeader: 'Product Code',
            },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'price', header: 'Price' },
            { field: 'inventoryStatus', header: 'Inventory Status' },
        ];

        this.exportColumns = this.cols.map((col) => ({
            title: col.header,
            dataKey: col.field,
        }));
    }

    onFilterGlobal(event: Event): void {
        const target = event.target as HTMLInputElement | null;
        if (target) {
            this.dt.filterGlobal(target.value, 'contains');
        }
    }

    getBadgeSeverity(inventoryStatus: string) {
        switch (inventoryStatus.toLowerCase()) {
            case 'instock':
                return 'success';
            case 'lowstock':
                return 'warn';
            case 'outofstock':
                return 'danger';
            default:
                return 'info';
        }
    }
}
