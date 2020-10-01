import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Settings } from "../../app.settings";
import { ClientStorage } from '../std/client-storage';
import { map } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { GeneXusClientClientInformation } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/client/client-information";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) { }

  public loginAnonymous(): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + 'access_token';
    let body = "grant_type=device";
    body += "&client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    const headers = new HttpHeaders(
      {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'DeviceId': GeneXusClientClientInformation.id(),
        'Genexus-Agent': 'SmartDevice Application'
      });

    return this._http.post(url, body, { headers: headers, withCredentials: true }).pipe(
      map((response: any) => {
        ClientStorage.Set('access_token', response.access_token);
        this.getUserInfo(response.access_token).subscribe(() => response.access_token);
      })
    );
  }

  public login(username: string, password: string) {
    const url = Settings.OAUTH_ENDPOINT + 'access_token';
    let body = "client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&grant_type=password&username=" + username;
    body += "&password=" + password;
    body += "&scope=FullControl";
    const headers = new HttpHeaders(
      {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Genexus-Agent': 'SmartDevice Application'
      });

    return this._http.post(url, body, { headers: headers, withCredentials: true }).pipe(
      map((response: any) => {
        ClientStorage.Set('access_token', response.access_token);
        this.getUserInfo(response.access_token).subscribe(() => response.access_token);
      })
    );
  }

  public loginExternal(type: string, username: string, password: string, additionalParameters: any = null) {
    const url = Settings.OAUTH_ENDPOINT + 'access_token';
    let body = "client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&grant_type=" + type;
    body += "&username=" + username;
    body += "&password=" + password
    body += "&scope=FullControl";
    if (additionalParameters) {
      body += "&additional_parameters=" + JSON.stringify(additionalParameters);
    }
    const headers = new HttpHeaders(
      {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Genexus-Agent': 'SmartDevice Application'
      });

    return this._http.post(url, body, { headers: headers, withCredentials: true }).pipe(
      map((response: any) => {
        ClientStorage.Set('access_token', response.access_token);
        this.getUserInfo(response.access_token).subscribe(() => response.access_token);
      })
    );
  }

  public logout() {
    return this._http.post(Settings.OAUTH_ENDPOINT + 'logout', "{}").pipe(
      map(() => {
        ClientStorage.Remove('access_token');
        window.location.reload();
      })
    );
  }

  public getUserInfo(token): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + 'userinfo';
    const body = "{}";
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'DeviceId': GeneXusClientClientInformation.id(),
        'Authorization': 'OAuth ' + token,
        'Genexus-Agent': 'SmartDevice Application'
      });
    return this._http.post(url, body, { headers: headers }).pipe(
      map(response => {
        const userInfo = JSON.stringify(response)
        ClientStorage.Set("gam_user", userInfo);
        return of(userInfo);
      })
    );
  }

  public getAuthToken(): string {
    return ClientStorage.Get('access_token');
  }
}