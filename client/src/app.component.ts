import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        TranslateModule
    ],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private config: PrimeNG) {}

    async ngOnInit() {
        try {
            // Try to load the Italian locale from CommonJS version
            const itModule = await import('primelocale/cjs/it.js');
            this.config.setTranslation(itModule.it as any);
        } catch (error) {
            console.warn('Could not load Italian locale, using default:', error);
        }
    }
}

