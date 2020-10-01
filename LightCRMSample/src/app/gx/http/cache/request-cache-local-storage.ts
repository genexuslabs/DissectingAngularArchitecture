
import {
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { IRequestCache } from './request-cache-interface';


export class RequestPersistentCacheLocalStorage implements IRequestCache {
    set(request: HttpRequest<any>, response: HttpResponse<any>) {
      localStorage.setItem(this.getKey(request), JSON.stringify(response));
    }
  
    async getAsync(request: HttpRequest<any>): Promise<HttpResponse<any>> {
      return new Promise<HttpResponse<any>>((resolve, reject) => {
        const json = localStorage.getItem(this.getKey(request));
        if (json) {
          resolve(Object.assign(new HttpResponse(), JSON.parse(json)));
        } else {
          resolve(null);
        }
      });
    }
  
    remove(request: HttpRequest<any>) {
      localStorage.removeItem(this.getKey(request));
    }
  
    private getKey(request: HttpRequest<any>): string {
      return request.urlWithParams.replace(/gxid=(\d*)&?/gi, "");
    }
  }