import {
  getOption as DesignSystemGetOption,
  getOptions as DesignSystemGetOptions,
} from "@genexus/web-standard-functions/dist/lib-esm/gxcore/common/ui/designsystem";
import { ClientStorage } from "../std/client-storage";
import { CookieService } from "ngx-cookie-service";
import { GxGuid } from "@genexus/web-standard-functions/dist/lib-esm/types/gxguid";
import { ImageService } from "./image.service";
import { Injectable, inject } from "@angular/core";
import { Settings } from "./../../app.settings";
import { Debounce } from "./debounce";
import { Subject } from "rxjs";
import { TranslationService } from "./../base/translation.service";
import { msg } from "@genexus/web-standard-functions/dist/lib-esm/misc/msg";
import { setLanguage as WSF_setLanguage } from "@genexus/web-standard-functions/dist/lib-esm/misc/setLanguage";
import { UriCacheService } from "app/gx/utils/uri-cache/uri-cache.service";
import { GxImage } from "@genexus/web-standard-functions/dist/lib-esm/types/gximage";
import { GxBinary } from "@genexus/web-standard-functions/dist/lib-esm/types/gxbinary";
import { LocationStrategy } from "@angular/common";
import { ThemeManager } from "./theme-manager";
import { LanguageManager } from "./language-manager";
import { GxAudio } from "@genexus/web-standard-functions/dist/lib-esm/types/gxaudio";
import { GxVideo } from "@genexus/web-standard-functions/dist/lib-esm/types/gxvideo";

@Injectable({
  providedIn: "root",
})
export class AppContainer {
  protected _translations = inject(TranslationService);
  protected _images = inject(ImageService);
  private cookieService = inject(CookieService);
  public uriCacheService = inject(UriCacheService);
  private locationStrategy = inject(LocationStrategy);

  private _errorCode = 0;
  private _errorString = "";

  private lang = new AppLanguageInfo("English", "MDY", 12);

  uiContextKey = "";
  uiContextSubject = new Subject<void>();

  async initApp(id: string) {
    const appId = ClientStorage.Get("gx.APP.id");
    if (!appId || appId != id) {
      ClientStorage.Clear();
      ClientStorage.Set("gx.APP.id", id);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Header Row Pattern
  showHeaderRowPatternClass = true;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Languages and translations

  async initLanguage(language: string) {
    let currentLanguage = this.getLanguage();
    if (!currentLanguage || currentLanguage === "") {
      currentLanguage = language;
      LanguageManager.setCurrentLanguage(language);
    }
    await this.loadLanguageInfo(currentLanguage);
    WSF_setLanguage(currentLanguage.toLowerCase());
  }

  getLanguage() {
    return LanguageManager.getCurrentLanguage();
  }

  async setLanguage(language: string) {
    if (this.canSetLanguage(language)) {
      const currLanguage = this.getLanguage();
      if (currLanguage.toLowerCase() !== language.toLowerCase()) {
        LanguageManager.setCurrentLanguage(language);
        window.location.reload();
      }
    }
  }

  async loadLanguageInfo(langName) {
    for (const l of Settings.applicationLanguages) {
      if (l.name.toLowerCase() === langName.toLowerCase()) {
        this.lang = new AppLanguageInfo(l.name, l.dateFormat, l.timeFormat);
        await this._translations.load(l.name);
        return;
      }
    }
  }

  canSetLanguage(langName): boolean {
    for (const l of Settings.applicationLanguages) {
      if (l.name.toLowerCase() === langName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  translate(key: string): string {
    return this._translations.translate(key);
  }

  async getMessageText(key: string, language?: string): Promise<string> {
    return await this._translations.getMessageText(key, language);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Themes and DSO

  async initTheme(theme: string) {
    let currentTheme = this.getTheme();
    if (!currentTheme || currentTheme === "") {
      currentTheme = theme;
      ThemeManager.setCurrentTheme(currentTheme);
    }
    ThemeManager.setCallbackRefreshUI(this.refreshUIContext.bind(this));
    ThemeManager.setStyle(currentTheme);
    ThemeManager.setDirection(
      this._translations.getLanguageDirection(this.lang.name)
    );
  }

  getTheme() {
    return ThemeManager.getCurrentTheme();
  }

  setTheme(theme: string) {
    const currentTheme = ThemeManager.getCurrentTheme();
    if (currentTheme.toLowerCase() !== theme.toLowerCase()) {
      ThemeManager.setEnforcedTheme(theme); // Should normalize theme casing!!
      window.location.reload();
    }
  }

  getColorScheme(): string {
    const colorScheme = DesignSystemGetOption("color-scheme")?.toLowerCase();

    if (!colorScheme && window.matchMedia) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else {
        return "light";
      }
    } else {
      return colorScheme || "light";
    }
  }

  getThemeOptions(): { name: string; value: string }[] {
    return DesignSystemGetOptions().filter(
      (option) => option.name.toLowerCase() != "color-scheme"
    );
  }

  refreshUIContext() {
    this._images.refresh();

    this.uiContextKey = `${this.lang.name}_${ThemeManager.getLoadedStyleName()}_${this.getColorScheme()}_${this.getThemeOptions()
        .map((option) => `${option.name}_${option.value}`)
        .join("_")}`;
    this.uiContextSubject.next();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Messages

  setMessage(message: string) {
    msg(message);
  }

  setError(errorCode: number, errorString = "") {
    this._errorCode = errorCode;
    this._errorString = errorString;
  }

  get err() {
    return this._errorCode;
  }
  get errMsg() {
    return this._errorString;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Utils

  setSession() {
    let ngSessionId = this.cookieService.get("gx-ng-session");
    if (!ngSessionId) {
      ngSessionId = GxGuid.newGuid().toString();
      this.cookieService.set("gx-ng-session", ngSessionId);
    }
  }

  open(id: string) {
    const uri = this.uriCacheService.get(id);
    window.open(uri, "_blank");
  }

  settings = Settings;
  debounce = Debounce;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Images and binaries
  getImage(name: string): GxImage {
    return this._images.getImage(name);
  }

  imageToURL(image: GxImage): string {
    let url = "";
    if (image.id) {
      url = this.getImage(image.id).uri;
    } else {
      url = image.uri;
    }
    return this.resolveRelativeURL(url);
  }

  serializeImage(image: GxImage): string {
    if (image.uri.startsWith("gxupload:")) {
      return image.uri;
    } else if (image.id) {
      return this.resolveRelativeURL(this.getImage(image.id).uri);
    } else {
      return this.resolveRelativeURL(image.uri);
    }
  }

  binaryToURL(binary: GxBinary): string {
    return this.resolveRelativeURL(binary.uri);
  }

  serializeBinary(binary: GxBinary): string {
    if (binary.uri.startsWith("gxupload:")) {
      return binary.uri;
    }
    return this.resolveRelativeURL(binary.uri);
  }

  serializeAudio(audio: GxAudio): string {
    if (audio.uri.startsWith("gxupload:")) {
      return audio.uri;
    }
    return this.resolveRelativeURL(audio.uri);
  }

  audioToURL(audio: GxAudio): string {
    return this.resolveRelativeURL(audio.uri);
  }

  createAudioFromObject(audio: object): GxAudio {
    const url = audio["uri"];
    const isPath = url.indexOf("/") > -1;
    if (isPath) {
      const imgLowerC = url.toLowerCase();
      if (imgLowerC.startsWith("file:") || imgLowerC.startsWith("data:")) {
        return GxAudio.createAudio(url.slice(5));
      }
    }
    return GxAudio.createAudio(url);
  }

  serializeVideo(video: GxVideo): string {
    if (video.uri.startsWith("gxupload:")) {
      return video.uri;
    }
    return this.resolveRelativeURL(video.uri);
  }

  videoToURL(video: GxVideo): string {
    return this.resolveRelativeURL(video.uri);
  }

  createVideoFromObject(video: object): GxVideo {
    const uri = video["uri"];
    const isPath = uri.indexOf("/") > -1;
    if (isPath) {
      const imgLowerC = uri.toLowerCase();
      if (imgLowerC.startsWith("file:") || imgLowerC.startsWith("data:")) {
        return GxVideo.createVideo(uri.slice(5));
      }
    }
    return GxVideo.createVideo(uri);
  }

  createFromID(id: string) {
    return new GxImage(id);
  }

  createFromValue(value: string) {
    return GxImage.createFromValue(value);
  }

  createImageFromURL(key: string): GxImage {
    let id = "";
    let url = "";
    const isPath = key.indexOf("/") > -1;
    if (isPath) {
      const imgLowerC = key.toLowerCase();
      if (imgLowerC.startsWith("file:") || imgLowerC.startsWith("data:")) {
        url = key.slice(5);
      } else {
        url = key;
      }
    } else {
      id = key;
    }
    return GxImage.createImage(id, url);
  }

  createBinaryFromObject(binary: object): GxBinary {
    return GxBinary.createBinaryFromObject(binary);
  }

  resolveRelativeURL(url: string) {
    if (!url) return "";
    const baseUrl = Settings.WEBAPP_BASE;
    const urlLower = url.toLowerCase();
    if (urlLower.startsWith("assets/")) {
      // Relative URL to local assets
      const appBaseURL =
        window.location.origin + this.locationStrategy.getBaseHref();
      return appBaseURL + url;
    } else if (
      urlLower.startsWith("http://") ||
      urlLower.startsWith("https://") ||
      urlLower.startsWith("blob:") ||
      urlLower.startsWith("file:") ||
      urlLower.startsWith("data:")
    ) {
      // Absolute URL
      return url;
    } else if (urlLower.startsWith(Settings.BASE_PATH.toLowerCase())) {
      // Host relative URL
      return baseUrl + url.substring(Settings.BASE_PATH.length);
    } else {
      return baseUrl + url;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Date and time settings

  getDateFormat() {
    return this.lang.dateFormat;
  }

  getTimeFormat(): number {
    return this.lang.timeFormat;
  }

  getFirstYearOf20Century(): number {
    return 40;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Http request sync/async processing
  enqueueHttpRequests = false;
  syncRequests = "first"; // 'first' || 'all'

  mustSyncRequest(): boolean {
    return this.enqueueHttpRequests;
  }

  mustSyncEveryRequest(): boolean {
    return this.syncRequests === "all";
  }

  mustSyncFirstRequest(): boolean {
    return this.syncRequests === "first";
  }

  setSyncFirstHttpRequest() {
    this.enqueueHttpRequests = true;
    this.syncRequests = "first";
  }

  setSyncEveryHttpRequest() {
    this.enqueueHttpRequests = true;
    this.syncRequests = "all";
  }

  setAyncHttpRequest() {
    this.enqueueHttpRequests = false;
    this.syncRequests = "async";
  }

  setupNextHttpRequest() {
    if (this.syncRequests === "first") {
      this.enqueueHttpRequests = false;
    }
  }
}

export class AppLanguageInfo {
  name: string;
  dateFormat: string;
  timeFormat: number;

  constructor(name: string, dateFormat: string, timeFormat: number) {
    this.name = name;
    this.dateFormat = dateFormat;
    this.timeFormat = timeFormat;
  }
}
