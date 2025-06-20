import { Component } from '@angular/core';
import { HeaderWidget } from './banking/headerwidget';
import { StatsBankingWidget } from './banking/statsbankingwidget';
import { RecentTransactionsWidget } from './banking/recenttransactionswidget';
import { OverviewWidget } from './banking/overviewwidget';
import { RecentTransactionsTwoWidget } from './banking/recenttransactionstwowidget';
import { MonthlyPaymentsWidget } from './banking/monthlypaymentswidget';
import { ProductService } from '@/pages/service/product.service'

@Component({
    selector: 'app-banking-dashboard',
    standalone: true,
    imports: [
        HeaderWidget,
        StatsBankingWidget,
        RecentTransactionsWidget,
        OverviewWidget,
        RecentTransactionsTwoWidget,
        MonthlyPaymentsWidget,
    ],
    providers: [ProductService],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-header-widget class="col-span-12" />
            <app-stats-banking-widget />

            <div class="col-span-12 xl:col-span-4">
                <app-recent-transactions-widget />
            </div>
            <div class="col-span-12 xl:col-span-8">
                <app-overview-widget />
            </div>
            <div class="col-span-12 lg:col-span-6">
                <app-recent-transactions-two-widget />
            </div>
            <div class="col-span-12 lg:col-span-6">
                <app-monthly-payments-widget />
            </div>
        </div>
    `,
})
export class BankingDashboard {}
