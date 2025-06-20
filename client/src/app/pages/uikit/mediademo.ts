import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import {GalleriaModule} from 'primeng/galleria';
import {ImageModule} from 'primeng/image';
import {TagModule} from 'primeng/tag';
import {PhotoService} from '@/pages/service/photo.service';
import {Product, ProductService} from '@/pages/service/product.service';
import {ImageCompareModule} from 'primeng/imagecompare';

@Component({
    selector: 'app-media-demo',
    standalone: true,
    imports: [CommonModule, CarouselModule, ButtonModule, GalleriaModule, ImageModule, TagModule, ImageCompareModule],
    template: `<div class="card">
            <div class="font-semibold text-xl mb-6">Carousel</div>
            <p-carousel [value]="products" [numVisible]="3" [numScroll]="3" [circular]="false" [responsiveOptions]="carouselResponsiveOptions">
                <ng-template let-product #item>
                    <div class="border border-surface rounded-border m-2 p-6">
                        <div class="mb-6">
                            <div class="relative mx-auto">
                                <img src="/demo/images/product/{{ product.image }}" [alt]="product.name" class="w-full rounded-border" />
                                <div class="absolute bg-black/70 rounded-border" [ngStyle]="{ 'left.px': 5, 'top.px': 5 }">
                                    <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" />
                                </div>
                            </div>
                        </div>
                        <div class="mb-6 font-medium">{{ product.name }}</div>
                        <div class="flex justify-between items-center">
                            <div class="mt-0 font-semibold text-xl">
                                {{ '$' + product.price }}
                            </div>
                            <span>
                                <p-button icon="pi pi-heart" severity="secondary" [outlined]="true" />
                                <p-button icon="pi pi-shopping-cart" styleClass="ml-2" />
                            </span>
                        </div>
                    </div>
                </ng-template>
            </p-carousel>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-6">Image</div>
            <p-image src="https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg" alt="Image" width="250" preview />
        </div>

        <div class="card flex flex-col">
            <div class="font-semibold text-xl mb-6">Image Compare</div>
            <p-imagecompare class="sm:!w-96 shadow-lg rounded-2xl">
                <ng-template #left>
                    <img src="https://primefaces.org/cdn/primevue/images/compare/island1.jpg" />
                </ng-template>
                <ng-template #right>
                    <img src="https://primefaces.org/cdn/primevue/images/compare/island2.jpg" />
                </ng-template>
            </p-imagecompare>
        </div>

        <div class="card">
            <div class="font-semibold text-xl mb-6">Galleria</div>
            <p-galleria [value]="images" [responsiveOptions]="galleriaResponsiveOptions" [containerStyle]="{ 'max-width': '640px' }" [numVisible]="5">
                <ng-template #item let-item>
                    <img [src]="item.itemImageSrc" style="width:100%" />
                </ng-template>
                <ng-template #thumbnail let-item>
                    <img [src]="item.thumbnailImageSrc" />
                </ng-template>
            </p-galleria>
        </div>`,
    providers: [ProductService, PhotoService]
})
export class MediaDemo implements OnInit {
    products!: Product[];

    images!: any[];

    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(
        private productService: ProductService,
        private photoService: PhotoService
    ) {}

    ngOnInit() {
        this.productService.getProductsSmall().then((products) => {
            this.products = products;
        });

        this.photoService.getImages().then((images) => {
            this.images = images;
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }
}
