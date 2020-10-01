import { HttpRequest, HttpResponse } from '@angular/common/http';
import { IRequestCache } from './request-cache-interface';

export class RequestNoCache implements IRequestCache {
    set(request: HttpRequest<any>, response: HttpResponse<any>) {}
  
    async getAsync(request: HttpRequest<any>): Promise<HttpResponse<any>> {
      return new Promise<HttpResponse<any>>((resolve, reject) => {
        resolve(new HttpResponse());
      });
    }
  
    remove(request: HttpRequest<any>) {}
  }
  
  