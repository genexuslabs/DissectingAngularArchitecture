import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { GAMUser } from "./gamuser.dt";
import { ProgressService } from '../ui/controls/progress/progress.service';
import { msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { ClientStorage } from '../std/client-storage';
import { AuthService } from './auth.service';
import { plainToClassFromExist } from "class-transformer";

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private _http: HttpClient,
    private _authService: AuthService,
    private progress: ProgressService) {
  }

  public async getUser(): Promise<GAMUser> {
    let userInfo = ClientStorage.Get("gam_user");
    if (!userInfo) {
      userInfo = await this._authService.getUserInfo(null).toPromise();
    }
    let o = JSON.parse(userInfo);
    return plainToClassFromExist(new GAMUser(), o);
  }

  public async login(username: string, password: string) {
    try {
      await this._authService.login(username, password).toPromise();
    } catch (e) {
      await this.progress.hide();
      await msg(e.error.error.message);
    };
  }

  public async loginExternal(type: string, username: string, password: string, additionalParameters: any = null) {
    try {
      await this._authService.loginExternal(type, username, password, additionalParameters).toPromise();
    } catch (e) {
      await this.progress.hide();
      await msg(e.error.error.message);
    };
  }

  public async logout() {
    this._authService.logout().subscribe();
  }

  public async getEmail(): Promise<string> {
    let user = await this.getUser();
    return user.getEmail();
  }

  public async getId(): Promise<string> {
    let user = await this.getUser();
    return user.getId();
  }

  public async isAnonymous(): Promise<boolean> {
    let user = await this.getUser();
    return user.isAnonymous();
  }
}

export class ResponseError {
  error: Error;
}

export class Error {
  code: number;
  message: string;
}
