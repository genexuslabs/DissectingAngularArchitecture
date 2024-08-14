import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable, throwError, timer } from "rxjs";
import { mergeMap, retryWhen } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class RetryInterceptor implements HttpInterceptor {

  retryDelay = 2000;
  retryAttempts = 3;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        this.retryAfterDelay(),
      );
  }

  retryAfterDelay(): any {
    return retryWhen(errors => {
      return errors.pipe(
        mergeMap((err, count) => {
          if (count >= this.retryAttempts) {
            return throwError(err);
          }
          if (err.status === 0 || (err.status >= 501 && err.status <= 599)) {
            console.log('Http error=' + err.status + " in " + err.url + ". Retry=" + (count + 1) + "/" + this.retryAttempts);
            return timer(this.retryDelay * (count + 1));
          }
          return throwError(err);
        })
      );
    });
  }
}

