import { LayoutService } from '@/layout/service/layout.service';
import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CheckboxModule,
        InputTextModule,
        FormsModule,
        RouterModule,
        IconFieldModule,
        InputIconModule,
        ButtonModule
    ],
    templateUrl: './auth.component.html'
})
export class Login {
    rememberMe: boolean = false;
    isDarkTheme: boolean | undefined = false;

    constructor(
        private layoutService: LayoutService
    ) {
        effect(() => {
            this.isDarkTheme = this.layoutService.isDarkTheme();
        });
    }

    
}
