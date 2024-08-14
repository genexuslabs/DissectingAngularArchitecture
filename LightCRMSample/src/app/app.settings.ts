import app_settings from "./../../app.settings.json";
import { ApplicationViewDefinition } from "app/gx/base/view-manager";
import { environment } from "./../environments/environment";
import { ApplicationLanguageDefinition } from "app/gx/base/language-manager";
import { ApplicationThemeDefinition } from "app/gx/base/theme-manager";

export class Settings {
  private static SERVICE_URL: string = environment.serviceUrl || app_settings.SERVICE_URL;

  public static get BACKEND_URL() {
    return app_settings.SERVICE_ORIGINAL_URL;
  }

  public static get GAM_CLIENT_ID(): string {
    return app_settings.GAM_CLIENT_ID;
  }

  public static get GAM_CLIENT_SECRET(): string {
    return app_settings.GAM_CLIENT_SECRET;
  }

  public static get GAM_CLIENT_LOGIN(): string {
    return app_settings.GAM_CLIENT_LOGIN;
  }

  public static get GAM_CLIENT_NOTAUTHORIZED(): string {
    return app_settings.GAM_CLIENT_NOTAUTHORIZED;
  }

  public static get GAM_CLIENT_CHANGEPASSWORD(): string {
    return app_settings.GAM_CLIENT_CHANGEPASSWORD;
  }

  public static get GAM_ANONYMOUS_USER(): boolean {
    return app_settings.GAM_ANONYMOUS_USER;
  }

  public static get DEBUG_ENABLED(): boolean {
    return app_settings.SERVICE_DEBUG;
  }

  public static get SERVICE_API_ENDPOINT(): string {
    return (
      Settings.SERVICE_URL +
      app_settings.SERVICE_REST_PATH
    );
  }

  public static get OAUTH_ENDPOINT(): string {
    return (
      Settings.SERVICE_URL +
      app_settings.SERVICE_OAUTH_PATH
    );
  }

  public static get WEBAPP_BASE(): string {
    return Settings.SERVICE_URL;
  }

  public static get BASE_PATH(): string {
    return app_settings.SERVICE_BASE_PATH;
  }

  public static get DEFAULT_LANGUAGE(): string {
    return app_settings.DEFAULT_LANGUAGE;
  }

  public static get convertTimeFromUTC(): boolean {
    return app_settings.CONVERT_TIME_FROM_UTC;
  }

  public static get loadComponentsWhenOnSight() {
    return true;
  }

  public static get applicationLanguages(): ApplicationLanguageDefinition[] {
    return app_settings.APPLICATION_LANGUAGES;
  }

  public static get applicationThemes(): ApplicationThemeDefinition[] {
    return app_settings.APPLICATION_THEMES;
  }

  public static get translationType(): string {
    return app_settings.TRANSLATION_TYPE;
  }

  public static DEFAULT_NAVIGATION_STYLE: string =
    app_settings.DEFAULT_NAVIGATION_STYLE;
}
