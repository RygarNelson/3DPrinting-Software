import { ChangeDetectorRef, Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { LayoutService } from '@/layout/service/layout.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-overview-widget',
    imports: [ChartModule],
    template: `
        <div class="card h-full">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Overview</div>
            <p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>
        </div>
    `
})
export class OverviewWidget {
    chartData: any;

    chartOptions: any;

    platformId = inject(PLATFORM_ID);

    layoutService = inject(LayoutService);

    constructor(private cd: ChangeDetectorRef) {}

    themeEffect = effect(() => {
        if (this.layoutService.transitionComplete()) {
            this.initChart();
        }
    });

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            this.chartData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Income',
                        data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
                        fill: false,
                        tension: 0.4,
                        borderColor: documentStyle.getPropertyValue('--p-green-500')
                    },
                    {
                        label: 'Expenses',
                        data: [1200, 5100, 6200, 3300, 2100, 6200, 4500],
                        fill: true,
                        borderColor: '#6366f1',
                        tension: 0.4,
                        backgroundColor: 'rgba(99,102,220,0.2)'
                    }
                ]
            };

            this.chartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.65,
                animation: {
                    duration: 0
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context: { dataset: { label: string }; parsed: { y: number | bigint | null } }) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }

                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
            this.cd.markForCheck();
        }
    }
}
