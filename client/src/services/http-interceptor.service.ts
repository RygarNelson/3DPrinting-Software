import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalstorageService } from './localstorage.service';

export function HttpInterceptorService(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorageService = inject(LocalstorageService);

  const handleErrors = (error: HttpErrorResponse) => {
    if (error.status === 401) {
      localStorageService.clear();
      router.navigate(['/login']);
    }

    return throwError(() => error);
  }

  if (localStorage.getItem('token')) {
    let headers: HttpHeaders = new HttpHeaders().set('token', localStorage.getItem('token') ?? '');

    let request = req.clone({ headers: headers });
    
    return next(request).pipe(
      tap((data: any) => {
        if (data.body && data.body.message) {
          setTimeout(() => messageService.add({
            severity: 'success',
            detail: data.body.message
          }), 100);
        }
      }),
      catchError(handleErrors)
    );
  } else {
    return next(req).pipe(
      tap((data: any) => {
        if (data.body && data.body.message) {
          setTimeout(() => messageService.add({
            severity: 'success',
            detail: data.body.message
          }), 100);
        }
      }),
      catchError(handleErrors)
    );

    
  }
}
