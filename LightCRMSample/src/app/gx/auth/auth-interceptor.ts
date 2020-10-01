import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, from, throwError } from "rxjs";
import { Settings } from "../../app.settings";
import { catchError, switchMap } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private _nvg: CompositeNavigation,
    private readonly _authService: AuthService
  ) { }

  private _refreshSubject: Subject<any> = new Subject<any>();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.endsWith("/access_token")) {
      return next.handle(req);
    } else {
      return next.handle(this.addAuthToken(req)).pipe(
        catchError((error, caught) => {
          if (error instanceof HttpErrorResponse) {
            if (this.authorizationRequired(error)) {
              if (Settings.GAM_ANONYMOUS_USER) {
                return this.loginAnonymous().pipe(
                  switchMap(() => {
                    return next.handle(this.addAuthToken(req));
                  })
                );
              } else {
                return this.login().pipe(
                  switchMap(() => {
                    return next.handle(this.addAuthToken(req));
                  })
                );
              }
            } else {
              return throwError(error);
            }
          }
          return caught;
        })
      );
    }
  }

  private loginAnonymous() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      this._authService.loginAnonymous().subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  private login() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length === 1) {
      from(this._nvg.navigate([Settings.GAM_CLIENT_LOGIN])).subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  private authorizationRequired(e: HttpErrorResponse): boolean {
    return (
      e.status &&
      e.status === 401 &&
      e.error && e.error.error &&
      e.error.error.message === "This service needs an Authorization Header"
    );
  }

  addAuthToken(req) {
    const token = this._authService.getAuthToken();
    if (token) {
      return req.clone({
        setHeaders: {
          'Authorization': 'OAuth ' + token,
          'Genexus-Agent': 'SmartDevice Application'
        }
      });
    } else {
      return req;
    }
  }
}
