import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { it } from 'primelocale/js/it.js';
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

    ngOnInit() {
        this.config.setTranslation(it);
    }
}

