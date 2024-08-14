import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { Settings } from "../../app.settings";
import { EMPTY } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CsrfToken {
  http = inject(HttpClient);
  cookieService = inject(CookieService);

  async refreshToken() {
    const vToken = this.cookieService.get("XSRF-TOKEN");
    if (!vToken) {
      const url = Settings.SERVICE_API_ENDPOINT;
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "Genexus-Agent": "SmartDevice Application",
      });
      return this.http
        .get(url, { headers: headers })
        .pipe(
          catchError(() => {
            // Can't get verification token -> Continue and would fail in backend CSRF check
            return EMPTY;
          })
        )
        .toPromise();
    }
  }
}
