import * as app_settings from "./../../app.settings.json";
import { ApplicationViewDefinition } from "./gx/base/view-manager";

export class Settings {
  private static SERVICE_DEBUG: boolean = app_settings.SERVICE_DEBUG;
  private static SERVICE_HOSTNAME: string = app_settings.SERVICE_HOSTNAME;
  private static SERVICE_BASE_PATH: string = app_settings.SERVICE_BASE_PATH;
  private static SERVICE_REST_PATH: string = app_settings.SERVICE_REST_PATH;
  private static SERVICE_OAUTH_PATH: string = app_settings.SERVICE_OAUTH_PATH;
  private static WEB_BASE_PATH: string =
    Settings.SERVICE_BASE_PATH + app_settings.WEB_RELATIVE_PATH;
  private static WEB_MAIN_OBJECT: string = app_settings.WEB_MAIN_OBJECT;

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
    return Settings.SERVICE_DEBUG;
  }
  public static get WEBROOT_URL(): string {
    return (
      Settings.SERVICE_HOSTNAME +
      Settings.WEB_BASE_PATH +
      Settings.WEB_MAIN_OBJECT
    );
  }
  public static get SERVICE_API_ENDPOINT(): string {
    return (
      Settings.SERVICE_HOSTNAME +
      Settings.SERVICE_BASE_PATH +
      Settings.SERVICE_REST_PATH
    );
  }
  public static get OAUTH_ENDPOINT(): string {
    return (
      Settings.SERVICE_HOSTNAME +
      Settings.SERVICE_BASE_PATH +
      Settings.SERVICE_OAUTH_PATH
    );
  }
  public static get GXOBJECT_ENDPOINT(): string {
    return Settings.WEB_BASE_PATH + "gxobject";
  }

  public static get WEBAPP_BASE(): string {
    return Settings.SERVICE_HOSTNAME;
  }

  private static DEFAULT_LANGUAGE: string = app_settings.DEFAULT_LANGUAGE;

  public static get loadComponentsWhenOnSight() {
    return true;
  }

  public static get applicationLayouts(): ApplicationViewDefinition[] {
    return app_settings.APPLICATION_LAYOUTS;
  }

  public static DEFAULT_NAVIGATION_STYLE: string =
    app_settings.DEFAULT_NAVIGATION_STYLE;
}
