import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService, private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token')) {
      let headers: HttpHeaders = new HttpHeaders().set('token', localStorage.getItem('token') ?? '');

      let request = req.clone({ headers: headers });
      
      return next.handle(request).pipe(
        tap((data: any) => {
          if (data.body && data.body.message) {
            setTimeout(() => this.messageService.add({
              severity: 'success',
              detail: data.body.message
            }), 100);
          }
        }),
        catchError((error: HttpErrorResponse) => { 
          return this.handleErrors(error)
        })
      );
    } else {
      return next.handle(req).pipe(
        tap((data: any) => {
          if (data.body && data.body.message) {
            setTimeout(() => this.messageService.add({
              severity: 'success',
              detail: data.body.message
            }), 100);
          }
        }),
        catchError((error: HttpErrorResponse) => { 
          return this.handleErrors(error)
        })
      );
    }
  }

  handleErrors(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error.status === 401) {
      this.authService.removeLocalStorage();

      this.router.navigate(['/login']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Errore',
        detail: error.error.error
      });
    }

    return throwError(() => error);
  }
}
