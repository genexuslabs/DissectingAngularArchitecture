import { Injectable } from "@angular/core";
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { concat } from "rxjs";
import { tap } from "rxjs/operators";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { IRequestCache } from './cache/request-cache-interface';
import { RequestPersistentCacheStorage } from './cache/request-cache-storage';
import { RequestPersistentCacheLocalStorage } from './cache/request-cache-local-storage';


@Injectable()
export class UriCachingStaleWhileRevalidateInterceptor
  implements HttpInterceptor {
  cache: IRequestCache = buildCache();
  cachedRequests = {};

  public intercept(httpRequest: HttpRequest<any>, handler: HttpHandler) {
    const newRequest = httpRequest.clone();

    const isCacheable = shouldResolveRequestFromCache(httpRequest, this.cachedRequests);
    if (!isCacheable){ 
      return handler.handle(newRequest);
    }
   
    if (httpRequest.headers.get("reset-cache")) {
      this.cache.remove(httpRequest);
    }

    const cachedResponse = this.cache.getAsync(httpRequest);
    
    const results$ = handler.handle(newRequest).pipe(
      tap((event) => {
          if (event instanceof HttpResponse) {
            if (isCacheableHttpResponse(event)) {
              this.cache.set(newRequest, event as HttpResponse<any>);
              this.cachedRequests[getCacheKey(newRequest.urlWithParams)] = true
            }
          }
      })
    );
    
    return concat(cachedResponse, results$);
  }
}

function shouldResolveRequestFromCache(request: HttpRequest<any>, cachedRequests: any): Boolean {
  return (
    request.method === "GET" &&
    request.headers.get("Cache-Control") !== "no-cache" &&
    request.headers.get("Content-Type") === "application/json" &&
    cachedRequests[getCacheKey(request.urlWithParams)] === undefined //Cache only first time GET of Object.
  );
}

function isCacheableHttpResponse(httpResponse: HttpResponse<any>) {
  const cacheControl = httpResponse.headers.get("Cache-Control");
  return !cacheControl || cacheControl.indexOf('private') < 0;
}

function getCacheKey(url: string): string {
  return url.replace(/start=(\d*)&?count=(\d*)&?/gi, "");
}

function buildCache(): IRequestCache {
  return (window["caches"] === undefined)? new RequestPersistentCacheLocalStorage(): new RequestPersistentCacheStorage();
}

export const HttpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: UriCachingStaleWhileRevalidateInterceptor,
    multi: true,
  },
];

