import {
  HttpRequest,
  HttpResponse
} from "@angular/common/http";

import { IRequestCache } from './request-cache-interface';

export class RequestPersistentCacheStorage implements IRequestCache {
    CACHE_NAME = "GX-APP-HTTP-CACHE";
  
    set(request: HttpRequest<any>, response: HttpResponse<any>) {
      const headers = new Headers();
      const headersKeys = response.headers.keys();
      for (let i = 0; i < headersKeys.length; i++) {
        headers.append(headersKeys[i], response.headers.get(headersKeys[i]));
      }    
      const myResponse = new Response(JSON.stringify(response.body), { status: response.status, statusText: response.statusText, headers: headers});
      caches
        .open(this.CACHE_NAME)
        .then((cache) => cache.put(this.getKey(request), myResponse));
    }
  
    async getAsync(request: HttpRequest<any>): Promise<HttpResponse<any>> {
      const key = this.getKey(request);
      return new Promise<HttpResponse<any>>((resolve, _) => {
        caches
          .open(this.CACHE_NAME)
          .then((cache) => {
            cache
              .match(key)
              .then((r) => {
                r.json().then((json) => {
                  const result = Object.assign(new HttpResponse(), {
                    body: json,
                  });
                  resolve(result);
                });
              })
              .catch((err) => {
                resolve(null);
              });
          })
          .catch((err) => {
            resolve(null);
          });
      });
    }
  
    remove(request: HttpRequest<any>) {
      caches
        .open(this.CACHE_NAME)
        .then((cache) => cache.delete(this.getKey(request)));
    }
  
    private getKey(request: HttpRequest<any>): string {
      return request.urlWithParams.replace(/gxid=(\d*)&?/gi, "");
    }
  }