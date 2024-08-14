import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { GAMUser } from "./gamuser.dt";
import { ProgressService } from '../ui/services/progress/progress.service';
import { msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { ClientStorage } from '../std/client-storage';
import { AuthService } from './auth.service';
import { TypeConversions } from '../base/type-conversion';
import { PanelComponent } from '../base/panel.component';
import { Settings } from 'app/app.settings';
import { CompositeNavigation } from "../navigation/composite-navigation";
import { AppContainer } from 'app/gx/base/app-container';

@Injectable({
  providedIn: 'root',
})
export class GAMService {

  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private progress = inject(ProgressService);
  private _nvg = inject(CompositeNavigation);
  private app = inject(AppContainer);

  public async getUser(): Promise<GAMUser> {
    let userInfo = ClientStorage.Get("gx.GAM.gam_user");
    if (!userInfo) {
      userInfo = await this._authService.getUserInfo(null).toPromise();
    }
    const o = JSON.parse(userInfo);
    return TypeConversions.objectToClass(o, GAMUser);
  }

  public async login(username: string, password: string): Promise<boolean> {
    try {
      this.app.setError(0);
      await this._authService.login(username, password).toPromise();
      return true;
    } catch (e) {
      await this.progress.hide();
      if (e instanceof HttpErrorResponse && e.status === 401 && e.error.error.code === '23') {
        this.app.setError(0);
        await msg(e.error.error.message);
        const __aSt = PanelComponent.activePanel.startAction();
        await this._nvg.navigate([Settings.GAM_CLIENT_CHANGEPASSWORD], __aSt);
        PanelComponent.activePanel.endAction(__aSt);
        return true;
      } else {
        this.app.setError(1, e.error.error.message);
        return false;
      }
    }
  }

  public async loginExternal(type: string, username: string, password: string, additionalParameters: any = null): Promise<boolean> {
    try {
      this.app.setError(0);
      await this._authService.loginExternal(type, username, password, additionalParameters).toPromise();
      return true;
    } catch (e) {
      this.app.setError(1, e.error.error.message);
      return false;
    }
  }

  public async registerAnonymous() {
    await this._authService.loginAnonymous().toPromise();
  }

  public async logout() {
    this._authService.logout().subscribe();
  }

  public async getEmail(): Promise<string> {
    const user = await this.getUser();
    return user.getEmail();
  }

  public async getId(): Promise<string> {
    const user = await this.getUser();
    return user.getId();
  }

  public async getName(): Promise<string> {
    const user = await this.getUser();
    return user.getName();
  }

  public async getLogin(): Promise<string> {
    const user = await this.getUser();
    return user.getLogin();
  }

  public async getExternalId(): Promise<string> {
    const user = await this.getUser();
    return user.getExternalId();
  }

  public async isAnonymous(): Promise<boolean> {
    const user = await this.getUser();
    return user.isAnonymous();
  }

  public isLogged(): boolean {
    const userToken = this._authService.getAuthToken();
    if (userToken && userToken != "null" && userToken.length > 0) {
      return true;
    }
    return false;
  }

  public async isLoginCallback(): Promise<boolean> {
    const on_external_login = ClientStorage.Get('gx.GAM.on_external_login');
    ClientStorage.Remove('gx.GAM.on_external_login');
    if (on_external_login == "true") {
      const access_token = this.getQueryParameter("access_token")
      const state = this.getQueryParameter("state")
      const refresh_token = this.getQueryParameter("refresh_token")

      if (access_token && state) {
        if (state == ClientStorage.Get("gx.GAM.login.state")) {
          ClientStorage.Remove('gx.GAM.login.state');
          this._authService.finishLogin(access_token, refresh_token);
          return true;
        }
      }
    }
    return false;
  }

  public setLoginInitiator(url: string) {
    this._authService.setLoginInitiator(url);
  }

  public redirectToLoginInitiator() {
    const initiatorUrl = this._authService.getLoginInitiator(true);
    window.location.href = initiatorUrl
  }

  private getQueryParameter(key: string): string | null {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get(key);
  }

}

export class ResponseError {
  error: Error;
}

export class Error {
  code: number;
  message: string;
}
