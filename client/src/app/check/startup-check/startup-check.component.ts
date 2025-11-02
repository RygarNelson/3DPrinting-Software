import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-startup-check',
  imports: [
    ProgressSpinnerModule
  ],
  templateUrl: './startup-check.component.html',
  styleUrl: './startup-check.component.scss'
})
export class StartupCheckComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();

      this.authService.checkToken(token).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
