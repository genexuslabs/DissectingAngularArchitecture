import { inject } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, from, throwError } from "rxjs";
import { Settings } from "../../app.settings";
import { catchError, switchMap } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { AuthService } from "./auth.service";
import { ClientStorage } from "../std/client-storage";
import { PanelComponent } from "../base/panel.component";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

  private _nvg = inject(CompositeNavigation);
  private _authService = inject(AuthService);

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
            if (this.authorizationMissing(error)) {    // Missing or invalid authorization token
              if (Settings.GAM_ANONYMOUS_USER) {
                // Login as anonymous user and continue
                return this.loginAnonymous().pipe(
                  switchMap(() => {
                    return next.handle(this.addAuthToken(req));
                  })
                );
              } else {
                // Ask for login and continue
                return this.navigateAndContinue(Settings.GAM_CLIENT_LOGIN).pipe(
                  switchMap(() => {
                    return next.handle(this.addAuthToken(req));
                  })
                );
              }
            } else if (this.notAuthorized(error)) {    // Not authorized 
              // Show "not authorized panel" and continue
              return this.navigateAndContinue(Settings.GAM_CLIENT_NOTAUTHORIZED).pipe(
                switchMap(() => {
                  return next.handle(this.addAuthToken(req));
                })
              );
            } else if (this.mustRefreshToken(error)) {    // Token expired
              return this.refreshToken().pipe(
                // Refresh token and continue
                switchMap(() => {
                  return next.handle(this.addAuthToken(req));
                })
              );
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

  private refreshToken() {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length > 0) {
      this._authService.refreshToken().pipe(
        catchError((error, caught) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.navigateAndContinue(Settings.GAM_CLIENT_LOGIN);
          }
          return caught;
        })



      ).subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  private navigateAndContinue(navigateTo: string) {
    this._refreshSubject.subscribe({
      complete: () => {
        this._refreshSubject = new Subject<any>();
      }
    });
    if (this._refreshSubject.observers.length > 0) {
      from(this.navigateEvent(navigateTo)).subscribe(this._refreshSubject);
    }
    return this._refreshSubject;
  }

  private async navigateEvent(navigateTo): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const __aSt = PanelComponent.activePanel.startAction();
      await this._nvg.navigateForResult([navigateTo], __aSt);
      PanelComponent.activePanel.endAction(__aSt);
      resolve();
    });
  }

  private authorizationMissing(e: HttpErrorResponse): boolean {
    return (
      e.status &&
      e.status === 401 &&
      e.error && e.error.error &&
      (
        e.error.error.code === "21" ||
        e.error.error.message === "This service needs an Authorization Header"
      )
    );
  }

  private notAuthorized(e: HttpErrorResponse): boolean {
    return (
      e.status &&
      e.status === 403 &&
      e.statusText.startsWith("Unauthorized")
    );
  }

  private mustRefreshToken(e: HttpErrorResponse): boolean {
    const refresh_token = ClientStorage.Get('gx.GAM.refresh_token')
    return (
      refresh_token !== null && refresh_token.length > 0 &&
      e.status &&
      e.status === 403
    );

  }

  addAuthToken(req) {
    const token = this._authService.getAuthToken();
    if (token) {
      return req.clone({
        setHeaders: {
          'Authorization': 'OAuth ' + token
        }
      });
    } else {
      return req;
    }
  }
}
