import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

type Payment = {
    name: string;
    amount: number;
    paid: boolean;
    date: string;
};

@Component({
    standalone: true,
    selector: 'app-monthly-payments-widget',
    imports: [TableModule, TagModule],
    template: `
        <div class="card">
            <div
                class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4"
            >
                Monthly Payments
            </div>

            <p-table [value]="payments" [rows]="5" dataKey="id">
                <ng-template #header>
                    <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template #body let-product>
                    <tr>
                        <td>{{ product.name }}</td>
                        <td>{{ product.amount }}</td>
                        <td>{{ product.date }}</td>
                        <td>
                            @if (product.paid) {
                                <p-tag
                                    value="COMPLETED"
                                    severity="success"
                                ></p-tag>
                            } @else {
                                <p-tag value="PENDING" severity="warn"></p-tag>
                            }
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
})
export class MonthlyPaymentsWidget {
    payments!: Payment[];

    ngOnInit() {
        this.payments = [
            {
                name: 'Electric Bill',
                amount: 75.6,
                paid: true,
                date: '06/04/2022',
            },
            {
                name: 'Water Bill',
                amount: 45.5,
                paid: true,
                date: '07/04/2022',
            },
            { name: 'Gas Bill', amount: 45.2, paid: false, date: '12/04/2022' },
            {
                name: 'Internet Bill',
                amount: 25.9,
                paid: true,
                date: '17/04/2022',
            },
            {
                name: 'Streaming',
                amount: 40.9,
                paid: false,
                date: '20/04/2022',
            },
        ];
    }
}
