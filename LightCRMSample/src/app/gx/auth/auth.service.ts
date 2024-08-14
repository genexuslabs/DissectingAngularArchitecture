import { inject } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Settings } from "../../app.settings";
import { ClientStorage } from "../std/client-storage";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { GeneXusClientClientInformation } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/client/client-information";
import { GlobalEvents } from "../base/global-events";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _http = inject(HttpClient);

  public loginAnonymous(): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + "access_token";
    let body = "grant_type=device";
    body += "&client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      DeviceId: GeneXusClientClientInformation.id(),
      "Genexus-Agent": "SmartDevice Application",
    });

    return this._http
      .post(url, body, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          ClientStorage.Set("gx.GAM.access_token", response.access_token);
          if (response.refresh_token) {
            ClientStorage.Set("gx.GAM.refresh_token", response.refresh_token);
          } else {
            ClientStorage.Remove("gx.GAM.refresh_token");
          }
          this.getUserInfo(response.access_token).subscribe(
            () => response.access_token
          );
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public login(username: string, password: string) {
    const url = Settings.OAUTH_ENDPOINT + "access_token";
    let body = "client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&grant_type=password&username=" + username;
    body += "&password=" + password;
    body += "&scope=FullControl";
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Genexus-Agent": "SmartDevice Application",
    });

    return this._http
      .post(url, body, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          this.finishLogin(response.access_token, response.refresh_token);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public loginExternal(
    type: string,
    username: string,
    password: string,
    additionalParameters: any = null
  ) {
    const url = Settings.OAUTH_ENDPOINT + "access_token";
    let body = "client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&grant_type=" + type;
    body += "&username=" + username;
    body += "&password=" + password;
    body += "&scope=FullControl";
    if (additionalParameters) {
      body += "&additional_parameters=" + JSON.stringify(additionalParameters);
    }
    body += "&avoid_redirect=true";

    const angularCallbackUrl = this.getLoginInitiator(false);
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Genexus-Agent": "SmartDevice Application",
      avoid_redirect: "true",
      redirect_clientloginurl: angularCallbackUrl,
    });

    return this._http
      .post(url, body, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          if (type == "GAMRemoteRest") {
            this.finishLogin(response.access_token, response.refresh_token);
          } else if (response.error?.code == 410) {
            const global: GlobalEvents = new GlobalEvents();
            global.publish(
              "GeneXusSecurity.GAMLoginEvents.TwoFactorAuthenticationRequested",
              []
            );
          } else if (
            additionalParameters.OTPStep == 1 &&
            response.error.code == 400
          ) {
            const global: GlobalEvents = new GlobalEvents();
            global.publish(
              "GeneXusSecurity.GAMLoginEvents.OTPAuthenticationRequested",
              []
            );
          } else if (additionalParameters.OTPStep == 2) {
            this.finishLogin(response.access_token, response.refresh_token);
          } else if (type == "GAMLocal") {
            //This is for 2fa cases when users doesn't need to do the second factor.
            this.finishLogin(response.access_token, response.refresh_token);
          } else {
            ClientStorage.Set("gx.GAM.on_external_login", "true");
            const url = response.Location;
            const regEx = RegExp("state=([^&]*)");
            const state = url.match(regEx);
            if (state != null) {
              ClientStorage.Set("gx.GAM.login.state", state[1]);
              window.location.href = url;
            } else return throwError("The state is empty");
          }
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public loginV2(
    username: string,
    password: string,
    additionalParameters: AdditionalParameters | null = null
  ) {
    const url = Settings.OAUTH_ENDPOINT + "gam/v2.0/access_token";
    let body = "client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&grant_type=password";
    body += "&username=" + username;
    body += "&password=" + password;
    body += "&scope=gam_user_data";
    if (additionalParameters) {
      if (additionalParameters.Repository) {
        body += "&repository=" + additionalParameters.Repository;
      }
      if (additionalParameters.AuthenticationTypeName) {
        body +=
          "&authentication_type_name=" +
          additionalParameters.AuthenticationTypeName;
      }
      if (
        additionalParameters.Properties &&
        additionalParameters.Properties.length > 0
      ) {
        body +=
          "&properties=" + JSON.stringify(additionalParameters.Properties);
      }
    }
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Genexus-Agent": "SmartDevice Application",
    });

    return this._http
      .post(url, body, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          this.finishLogin(response.access_token, response.refresh_token);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public refreshToken(): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + "access_token";
    let body = "grant_type=refresh_token";
    body += "&client_id=" + Settings.GAM_CLIENT_ID;
    body += "&client_secret=" + Settings.GAM_CLIENT_SECRET;
    body += "&refresh_token=" + ClientStorage.Get("gx.GAM.refresh_token");
    const headers = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      DeviceId: GeneXusClientClientInformation.id(),
      "Genexus-Agent": "SmartDevice Application",
    });

    return this._http
      .post(url, body, { headers: headers, withCredentials: true })
      .pipe(
        map((response: any) => {
          this.finishLogin(response.access_token, response.refresh_token);
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public logout() {
    const headers = new HttpHeaders({
      Authorization: "OAuth " + this.getAuthToken(),
      "Genexus-Agent": "WebFrontend Application",
    });
    return this._http
      .post(Settings.OAUTH_ENDPOINT + "logout", "{}", {
        headers: headers,
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          if (response.code == 201) {
            const token = this.getAuthToken();
            AuthService.cleanClientStorage();
            this.triggerLogout(token).subscribe((logoutResponse) => {
              const url = logoutResponse["GXLocation"];
              window.location.href = url;
            });
          } else {
            if (response.headers != undefined)
              window.location.href = response.headers["GXLocation"];
            else {
              AuthService.cleanClientStorage();
              window.location.reload();
            }
          }
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public triggerLogout(token): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + "logout";
    const body = "{}";
    const headers = new HttpHeaders({
      "Genexus-Agent": "WebFrontend Application",
      "IDP-Logout": "true",
      Authorization: "OAuth " + token,
    });
    return this._http.post(url, body, { headers: headers }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public getUserInfo(token): Observable<any> {
    const url = Settings.OAUTH_ENDPOINT + "userinfo";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      DeviceId: GeneXusClientClientInformation.id(),
      Authorization: "OAuth " + token,
      "Genexus-Agent": "SmartDevice Application",
    });
    return this._http.get(url, { headers: headers }).pipe(
      map((response) => {
        const userInfo = JSON.stringify(response);
        ClientStorage.Set("gx.GAM.gam_user", userInfo);
        return of(userInfo);
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  public getAuthToken(): string {
    return ClientStorage.Get("gx.GAM.access_token");
  }

  public getLoginInitiator(clean: boolean): string {
    const loginInitiator = ClientStorage.Get("gx.GAM.login_initiator");
    if (loginInitiator) {
      if (clean) ClientStorage.Remove("gx.GAM.login_initiator");

      return loginInitiator;
    } else return window.location.origin;
  }

  public setLoginInitiator(url: string) {
    ClientStorage.Set("gx.GAM.login_initiator", url);
  }

  public redirectToLoginInitiator() {
    const initiatorUrl = this.getLoginInitiator(true);
    window.location.href = initiatorUrl;
  }

  public finishLogin(access_token: string, refresh_token: string | null) {
    AuthService.cleanClientStorage();
    ClientStorage.Set("gx.GAM.access_token", access_token);
    if (refresh_token) ClientStorage.Set("gx.GAM.refresh_token", refresh_token);

    this.getUserInfo(access_token).subscribe(() =>
      this.redirectToLoginInitiator()
    );
  }

  public static cleanClientStorage() {
    ClientStorage.Remove("gx.GAM.access_token");
    ClientStorage.Remove("gx.GAM.refresh_token");
    ClientStorage.Remove("gx.GAM.gam_user");
  }
}

class AdditionalParameters {
  Repository: string;
  AuthenticationTypeName: string;
  Properties: Array<AdditionalParametersProperty>;
}

class AdditionalParametersProperty {
  Id: string;
  Value: string;
}
