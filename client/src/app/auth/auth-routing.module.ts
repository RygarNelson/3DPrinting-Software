import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { ErrorComponent } from './error/error.component';
import { ForgotPasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { NewPasswordComponent } from './newpassword/newpassword.component';
import { RegisterComponent } from './register/register.component';
import { VerificationComponent } from './verification/verification.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'error', component: ErrorComponent },
        { path: 'accessdenied', component: AccessdeniedComponent },
        { path: 'login', component: LoginComponent },
        { path: 'forgotpassword', component: ForgotPasswordComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'newpassword', component: NewPasswordComponent },
        { path: 'verification', component: VerificationComponent },
    ])],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
