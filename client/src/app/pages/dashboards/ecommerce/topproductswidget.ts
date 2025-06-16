import { Component } from '@angular/core';
import { Product, ProductService } from '@/pages/service/product.service'
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-top-products-widget',
    imports: [CommonModule, RatingModule, FormsModule],
    template: `<div class="card h-full">
        <div
            class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4"
        >
            Top Products
        </div>
        <ul class="list-none p-0 m-0">
            <ng-container *ngFor="let product of products; let i = index">
                <li *ngIf="i < 6" class="flex items-center justify-between p-4">
                    <div class="inline-flex items-center">
                        <img
                  [src]="'https://primefaces.org/cdn/primeng/images/demo/product/' + product.image"
                            [alt]="product.name"
                            width="75"
                            class="shadow flex-shrink-0"
                        />
                        <div class="flex flex-col ml-4">
                            <span class="font-medium text-lg mb-1">{{
                                product.name
                            }}</span>
                            <p-rating
                                [(ngModel)]="product.rating"
                                [readonly]="true"
                            ></p-rating>
                        </div>
                    </div>
                    <span
                        class="ml-auto font-semibold text-xl p-text-secondary"
                    >
                    {{ product.price | currency:'USD':'symbol':'1.0-0' }}
                    </span>
                </li>
            </ng-container>
        </ul>
    </div> `,
    providers: [ProductService],
})
export class TopProductsWidget {
    products!: Product[];

    constructor(private productService: ProductService) {}
    ngOnInit() {
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));
    }
}
