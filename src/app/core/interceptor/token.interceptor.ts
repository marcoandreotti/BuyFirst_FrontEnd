import { AuthService } from '@app/service/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Injector } from '@angular/core';
import { ThemeService } from '@app/service/theme.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private _themeService: ThemeService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reqWithCredentials = req.clone({ withCredentials: true });
    return next.handle(reqWithCredentials)
      .pipe(
        catchError(error => {
          //debugger;
          switch (error.status) {
            case (400): {
              this._themeService.geraErro(error);
              break;
            }
            case (401 || 403): {
              localStorage.removeItem('token');
              this.router.navigateByUrl('');
              break;
            }
          }
          return throwError(error);
        })
      );
  }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private _themeService: ThemeService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._themeService.startLoading();
    return next.handle(req).pipe(
      finalize(() => this._themeService.stopLoading())
    );
  }
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private injector: Injector) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    let auth = this.authService.getState();
    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${auth != null ? auth.jwToken : ''}`
      }
    });
    return next.handle(request);
  }
}