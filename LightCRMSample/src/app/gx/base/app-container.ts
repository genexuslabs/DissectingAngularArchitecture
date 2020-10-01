import { Injectable } from "@angular/core";
import { TranslationService } from "./../base/translation.service";
import { ImageService } from "./image.service";
import { Settings } from "./../../app.settings";
import { msg } from "@genexus/web-standard-functions/dist/lib-esm/misc/msg";
import { setLanguage } from "@genexus/web-standard-functions/dist/lib-esm/misc/setLanguage";
import { CookieService } from "ngx-cookie-service";
import { GUID } from "@genexus/web-standard-functions/dist/lib-esm/types/guid";
import { ClientStorage } from '../std/client-storage';

@Injectable({
  providedIn: "root"
})
export class AppContainer {

  constructor(
    protected _translations: TranslationService,
    protected _images: ImageService,
    private cookieService: CookieService
  ) { }

  private currentLanguage = "English";

  initApp(id: string) {
    const appId = ClientStorage.Get('gx.APP.id');
    if (!appId || appId != id) {
      ClientStorage.Clear();
      ClientStorage.Set('gx.APP.id', id);
    }
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    setLanguage(language);
  }

  async initTheme(theme: string) {
    let currentTheme = this.getTheme();
    if (currentTheme === '') {
      currentTheme = theme.toLowerCase();
      ClientStorage.Set('gx.APP.theme', currentTheme);
    }
    await this._images.load(this.currentLanguage, currentTheme);
    StyleManager.setStyle(currentTheme);

  }

  getTheme() {
    return ClientStorage.Get('gx.APP.theme') || '';
  }

  setTheme(theme: string) {
    const currentTheme = this.getTheme();
    if (currentTheme !== theme.toLowerCase()) {
      ClientStorage.Set('gx.APP.theme', theme.toLowerCase());
      window.location.reload();
    }
  }

  async initTranslations() {
    await this._translations.load(
      this.currentLanguage
    );
  }

  setMessage(message: string) {
    msg(message);
  }

  translate(key: string): string {
    return this._translations.translate(key);
  }

  getImageSource(key: string): string {
    return this._images.getImageSource(
      key,
      this.currentLanguage,
      this.getTheme()
    );
  }

  getBaseUrl() {
    return Settings.WEBAPP_BASE;
  }

  setSession() {
    let ngSessionId = this.cookieService.get("gx-ng-session");
    if (!ngSessionId) {
      ngSessionId = GUID.newGuid().toString();
      this.cookieService.set("gx-ng-session", ngSessionId);
    }
  }
}

class StyleManager {
  static setStyle(name: string) {
    this.getLinkElementForKey().setAttribute('href', name + ".css");
  }

  static removeStyle(key: string) {
    const existingLinkElement = this.getExistingLinkElementByKey();
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  static getLinkElementForKey() {
    return this.getExistingLinkElementByKey() || this.createLinkElementWithKey();
  }

  static getExistingLinkElementByKey() {
    return document.head.querySelector(`link[rel="stylesheet"].${"style-manager-theme"}`);
  }

  static createLinkElementWithKey() {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.type = 'text/css';
    linkEl.classList.add("style-manager-theme");
    document.head.appendChild(linkEl);
    return linkEl;
  }
}
