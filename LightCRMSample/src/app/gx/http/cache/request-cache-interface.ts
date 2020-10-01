import {
    HttpRequest,
    HttpResponse
  } from "@angular/common/http";
  
  export interface IRequestCache {
    set(request: HttpRequest<any>, response: HttpResponse<any>);
    getAsync(request: HttpRequest<any>): Promise<HttpResponse<any>>;
    remove(request: HttpRequest<any>);
}