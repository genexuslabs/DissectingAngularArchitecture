import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Settings } from "../../app.settings";
import { LoginService } from "app/gx/auth/login.service";
import { GxCollectionData } from "./gxcollection.dt";
import { GeneXusClientClientInformation } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/client/client-information";
import { TypeConversions } from "./type-conversion";
import { Observable } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";

export class EndpointConnector {

  public static postData(http: HttpClient, endpoint: string, data: any, typeSpecs: any = {}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      http.post(endpoint, this.getJsonPayload(data), { headers: this.getHeaders(), withCredentials: true }).toPromise().then(
        response => {
          for (const tName in typeSpecs) {
            if (typeSpecs[tName].isCollection) {
              response[tName] = TypeConversions.arrayToCollection(response[tName] as any, typeSpecs[tName].type);
            }
          }
          resolve(response)
        }
      ).catch(
        response => reject(response)
      )
    });
  }

  public static getData(http: HttpClient, endpoint: string): Promise<any> {
    return http.get(endpoint, { headers: this.getHeaders(), withCredentials: true })
      .toPromise()
  }

  public static getDataForType<T>(http: HttpClient, endpoint: string, c: { new(): T; }): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      http.get(endpoint, { headers: this.getHeaders(), withCredentials: true }).toPromise().then(
        response => {
          const obj = TypeConversions.objectToClass<T>(response, c);
          resolve(obj);
        }
      ).catch(
        response => reject(response)
      )
    });
  }

  public static getCacheableDataCollectionForType<T>(http: HttpClient, endpoint: string, c: { new (): T } = null): Observable<GxCollectionData<T>> {
    return this.getDataCollectionForTypeObservableImpl(http, endpoint, true, c);
  }

  private static getDataCollectionForTypeObservableImpl<T>(http: HttpClient, endpoint: string, cacheable: boolean, c: { new (): T } = null): Observable<GxCollectionData<T>> {
    const result = http.get(endpoint, { headers: this.getHeaders(cacheable), withCredentials: true })
      .pipe(map((ev) => {
          return c? TypeConversions.arrayToCollection(ev as any, c): (ev as any);
        })
      );
    return result;
  }

  public static getDataCollectionForTypeObservable<T>(http: HttpClient, endpoint: string, c: { new (): T } = null): Observable<GxCollectionData<T>> {
    return this.getDataCollectionForTypeObservableImpl(http, endpoint, false, c);
  }


  public static getDataCollectionForType<T>(http: HttpClient, endpoint: string, c: { new(): T; } = null): Promise<GxCollectionData<T>> {
    return new Promise<GxCollectionData<T>>((resolve, reject) => {
      http.get(endpoint, { headers: this.getHeaders(), withCredentials: true }).toPromise().then(
        (response: any) => {
          resolve((c) ? TypeConversions.arrayToCollection(response, c) : response)
        }
      ).catch(
        response => reject(response)
      )
    });
  }

  public static uploadGXobject(http: HttpClient, loginService: LoginService, file: File): Promise<any> {
    let uri = Settings.WEBAPP_BASE + 'gxobject';
    let headers = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'image' });
    let options = { headers: headers, withCredentials: true };
    return http.post(uri, file, options).toPromise();
  }

  private static getHeaders(staleWhileRevalidate?: boolean) {
    return new HttpHeaders({
      "Content-Type": "application/json",
      "DeviceId": GeneXusClientClientInformation.id(),
      "DeviceType": GeneXusClientClientInformation.deviceType().toString(),
      "Cache-Control": (staleWhileRevalidate) ? "must-revalidate" : "no-cache"
    });
  }

  private static getJsonPayload(data: any): string {
    let jsonData = null;
    if (typeof data === "string") {
      jsonData = data;
    } else {
      jsonData = JSON.stringify(data, (key, value) => {
        if (key === "uiModel") {
          return undefined;
        }
        return value;
      });
    }
    return jsonData;
  }
}
