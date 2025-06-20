import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    standalone: true,
    selector: 'app-sales-by-category-widget',
    imports: [ChartModule],
    template: ` <div class="card h-full">
        <div
            class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-12"
        >
            Sales by Category
        </div>
        <p-chart
            type="pie"
            [data]="pieData"
            height="300"
            [options]="pieOptions"
        ></p-chart>
    </div>`,
})
export class SalesByCategoryWidget {
    pieData: any;

    pieOptions: any;

    subscription!: Subscription;

    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(50))
            .subscribe(() => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieData = {
            labels: ['Electronics', 'Fashion', 'Household'],
            datasets: [
                {
                    data: [300, 50, 100],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--p-primary-700'),
                        documentStyle.getPropertyValue('--p-primary-400'),
                        documentStyle.getPropertyValue('--p-primary-100'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--p-primary-600'),
                        documentStyle.getPropertyValue('--p-primary-300'),
                        documentStyle.getPropertyValue('--p-primary-200'),
                    ],
                },
            ],
        };
        this.pieOptions = {
            animation: {
                duration: 0,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        font: {
                            weight: 700,
                        },
                        padding: 28,
                    },
                    position: 'bottom',
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
