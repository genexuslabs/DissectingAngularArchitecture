import { Injectable, inject } from "@angular/core";
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable, ReplaySubject } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AppContainer } from "../base/app-container";

@Injectable()
export class RequestQueueInterceptor {
  private queue: ReplaySubject<any>[] = [];

  private app = inject(AppContainer);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.app.mustSyncRequest()) {
      const requestQueueItem$ = new ReplaySubject<any>();
      const result$ = requestQueueItem$.pipe(
        switchMap(() =>
          next.handle(request).pipe(
            tap((req) => {
              if (req.type == HttpEventType.Response) {
                this.app.setupNextHttpRequest();
                this.processNextRequest();
              }
            }),
            catchError((err) => {
              this.processNextRequest();
              throw err;
            })
          )
        )
      );
      this.queue.push(requestQueueItem$);

      if (this.queue.length <= 1) {
        this.dispatchRequest();
      }
      return result$;
    } else {
      while (this.processNextRequest()); // Exhaust queued requests
      return next.handle(request);
    }
  }

  private processNextRequest(): boolean {
    if (this.queue && this.queue.length > 0) {
      this.queue.shift();
    }
    return this.dispatchRequest();
  }

  private dispatchRequest(): boolean {
    if (this.queue.length > 0) {
      const nextSub$: ReplaySubject<void> = this.queue[0];
      nextSub$.next();
      nextSub$.complete();
      return true;
    }
    return false;
  }
}
