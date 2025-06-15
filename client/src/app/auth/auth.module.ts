import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { VerificationComponent } from './verification/verification.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { RegisterComponent } from './register/register.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { ErrorComponent } from './error/error.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { AuthService } from '../services/auth.service';

@NgModule({
    declarations: [
        LoginComponent,
        VerificationComponent,
        RegisterComponent,
        NewPasswordComponent,
        ForgotPasswordComponent,
        ErrorComponent,
        AccessdeniedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        CheckboxModule,
        InputTextModule,
        ButtonModule,
        InputNumberModule
    ],
    providers: [
        AuthService
    ]
})
export class AuthModule { }
