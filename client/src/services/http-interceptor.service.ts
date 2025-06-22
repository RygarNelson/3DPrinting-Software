import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

export function HttpInterceptorService(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);

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
      })
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
      })
    );

    
  }
}
