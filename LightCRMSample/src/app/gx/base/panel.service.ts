import { Router } from "@angular/router";
import { msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { LoginService } from "app/gx/auth/login.service";
import { TypeConversions } from "./type-conversion";


export class PanelService {
  private router: Router;
  private loginService: LoginService;

  gxids = [];

  constructor(_router: Router, _loginService: LoginService) {
    this.router = _router;
    this.loginService = _loginService;
  }

  start() {
    this.gxids = [];
  }

  public async handleError(e: any): Promise<any> {
    let message = null;
    if (e && e.error && e.error.error && e.error.error.message) {
      message = e.error.error.message || e.message;
    } else if (e && e.message) {
      message = e.message;
    }
    if (message) {
      await msg(message);
    }
    return Promise.resolve(message || e);
  }

  getGxid(serviceId: number) {
    if (!this.gxids[serviceId]) {
      this.gxids[serviceId] = Math.floor(Math.random() * 100000000 + 1);
    }
    return this.gxids[serviceId];
  }

  dateToISOString(d: Date): string {
    //We should use Timezone offset. But in order to work with current services, we must remove timezone offset.
    return TypeConversions.datetimeToISOString(d);
  }
}
