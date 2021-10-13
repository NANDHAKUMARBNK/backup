import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  constructor(
    private storageService: StorageService,
    private router: Router,
  ) { 
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let tokenAuth: any;
    const Apptoken = this.storageService.getData('appToken') && JSON.parse(this.storageService.getData('appToken'));
    const usertoken = this.storageService.getData('userToken') && JSON.parse(this.storageService.getData('userToken'));
    const token = request.url.includes('authValid') ? Apptoken && Apptoken.token || '' : usertoken && usertoken.token || '';
    if (token && !request.url.includes('newUserToken')) {
      tokenAuth = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
    } else {
      tokenAuth = request.clone({
        setHeaders: {
        },
        // withCredentials: true, 
        // user not logged in
      });
    }
    return next.handle(tokenAuth)
      .pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // todo
        }
        return event;
      }))
      .pipe(catchError((err: HttpEvent<any>) => {
        if (err instanceof HttpErrorResponse) {
          // console.log(err.error,'errerrerrerr');
          if (err.error && err.error.result && err.error.result.statusCode === 403) {
            if (!request.url.includes('noNavigate')) {
              this.router.navigate(['admin/error'])
            }
          }
          if (err.error && err.error.result && err.error.result.statusCode === 401) {
            // this.toastr.showToastr("error", err.error.result.errorMessages && err.error.result.errorMessages.length && err.error.result.errorMessages[0] || 'Session Expired');
            this.storageService.removeAllData();
            this.router.navigate(['login']);
            window.location.reload();
          }
          // todo
          return throwError(err);
        }
        return new Observable<HttpEvent<any>>();
      }));
  }

}
