import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent {

	public email: string = '';
	public password: string = '';
	public rememberMe: boolean = false;

	constructor(private router: Router, private messageService: MessageService, private authService: AuthService) {}

	login(): void {
		this.authService.login(this.email, this.password).subscribe({
			next: (result) => {
				this.authService.registerLocalStorage(result.data);
				setTimeout(() => this.messageService.add({
					severity: 'success',
					detail: 'Login effettuato con successo!'
				}), 100);
				this.router.navigate(['/']);
			},
			error: (error) => {
				this.messageService.add({
					severity: 'error',
					summary: 'Errore',
					detail: error.error.error
				});
			}
		});
	}

}
