import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Settings } from "../../app.settings";
import { GeneXusClientClientInformation } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/client/client-information";
import { ThemeManager } from "./theme-manager";
import { LanguageManager } from "./language-manager";

export type EndpointConnectorHeaders = {
  recordCount?: boolean;
  cacheable?: boolean;
};

export class EndpointConnector {
  public static getResponse(
    http: HttpClient,
    endpoint: string,
    headers?: EndpointConnectorHeaders
  ): Promise<any> {
    return http
      .get(endpoint, {
        headers: this.getHeaders(headers),
        withCredentials: true,
        observe: "response",
      })
      .toPromise();
  }

  public static getData(
    http: HttpClient,
    endpoint: string,
    cacheable = false
  ): Promise<any> {
    return http
      .get(endpoint, {
        headers: this.getHeaders({ cacheable }),
        withCredentials: true,
      })
      .toPromise();
  }

  public static deleteData(http: HttpClient, endpoint: string): Promise<any> {
    return http
      .delete(endpoint, { headers: this.getHeaders(), withCredentials: true })
      .toPromise();
  }

  public static putData(
    http: HttpClient,
    endpoint: string,
    data: any
  ): Promise<any> {
    return http.put(endpoint, data, { headers: this.getHeaders() }).toPromise();
  }

  public static postData1(
    http: HttpClient,
    endpoint: string,
    data: any
  ): Promise<any> {
    return http
      .post(endpoint, data, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .toPromise();
  }

  public static uploadGXobject(
    http: HttpClient,
    endpointObject: string,
    file: File
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let uri = Settings.SERVICE_API_ENDPOINT + "gxobject";
      if (endpointObject) {
        uri = Settings.SERVICE_API_ENDPOINT + endpointObject + "/gxobject";
      }
      let contentType = "image";
      if (file.type) {
        contentType = file.type;
      }
      const headers = new HttpHeaders({
        Accept: "application/json",
        "Content-Type": contentType,
        "x-gx-filename": this.doblebyteToSinglebyte(file.name)
      });
      const options = { headers: headers, withCredentials: true };
      http
        .post(uri, file, options)
        .toPromise()
        .then((response) => resolve(response))
        .catch((response) => reject(response));
    });
  }
  static doblebyteToSinglebyte(name: string): string {
    const enc = new TextEncoder();
    const byteArray: Array<number> = [];
    enc.encode(name).forEach(x => byteArray.push(x));
    return String.fromCharCode(...byteArray);
  }

  private static getHeaders(headers: EndpointConnectorHeaders = {}) {
    return new HttpHeaders({
      "Content-Type": "application/json",
      DeviceId: GeneXusClientClientInformation.id(),
      DeviceType: GeneXusClientClientInformation.deviceType().toString(),
      "Cache-Control": headers.cacheable ? "must-revalidate" : "no-cache",
      GxTZOffset: this.getTimezone(),
      "GeneXus-Theme": ThemeManager.getCurrentTheme(),
      "GeneXus-Language": LanguageManager.getCurrentLanguage(),
      ...(headers.recordCount && { RecordCount: "true" }),
    });
  }

  private static getTimezone(): string {
    const germanFakeRegion = new Intl.DateTimeFormat();
    return germanFakeRegion.resolvedOptions().timeZone;
  }
}
