import { ClientStorage } from "app/gx/std/client-storage";
import { Settings } from "app/app.settings";

export class ThemeManager {
  private static loadadStyleName = "";
  private static callbackRefreshUI: () => void = null;

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Theme/DSO persistence

  static getCurrentTheme(): string {
    return (ThemeManager.getEnforcedTheme() ?? ClientStorage.Get("gx.APP.theme")) || "";
  }

  static setCurrentTheme(theme: string) {
    for (const thm of Settings.applicationThemes) {
      if (thm.name.toLowerCase() === theme.toLowerCase()) {
        ClientStorage.Set("gx.APP.theme", thm.gxName);
        return;
      }
    }
    ClientStorage.Set("gx.APP.theme", theme);
  }

  static setEnforcedTheme(theme: string) {
    if (theme) {
      for (const thm of Settings.applicationThemes) {
        if (thm.name.toLowerCase() === theme.toLowerCase()) {
          ClientStorage.Set("gx.APP.enforcedTheme", thm.gxName);
          return;
        }
      }
      ClientStorage.Set("gx.APP.enforcedTheme", theme);
    } else {
      ClientStorage.Remove("gx.APP.enforcedTheme");
    }
  }

  static getEnforcedTheme() {
    const enforcedTheme = ClientStorage.Get("gx.APP.enforcedTheme")
    return enforcedTheme ? enforcedTheme : null;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // RefreshUIContext

  static setCallbackRefreshUI(fn: () => void) {
    this.callbackRefreshUI = fn;
  }

  static getLoadedStyleName(): string {
    return this.loadadStyleName;
  }

  private static setLoadedStyleName(name: string) {
    this.loadadStyleName = name ?? "";
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  // CSS style management

  static setStyle(name: string) {

    const themeToSet = ThemeManager.getEnforcedTheme() ?? name;
    const cssToSet = ThemeManager.toThemeName(themeToSet);
    let stylesheet: HTMLStyleElement;

    this.setLoadedStyleName("");

    stylesheet = this.getExistingLinkElementByKey();
    if (!stylesheet) {
      stylesheet = this.createLinkElementWithKey();
    }

    if (stylesheet.dataset.styleName !== themeToSet) {
      stylesheet.setAttribute("href", cssToSet);
      stylesheet.setAttribute("id", "base-stylesheet");
      stylesheet.dataset.styleName = themeToSet;
    }

  }

  static setDirection(dir: "ltr" | "rtl") {
    document.documentElement.setAttribute("dir", dir);
  }

  static removeStyle(key: string) {
    const existingLinkElement = this.getExistingLinkElementByKey();
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  static getExistingLinkElementByKey(): HTMLStyleElement {
    return document.head.querySelector(`link[id="base-stylesheet"]`);
  }

  static createLinkElementWithKey(): HTMLStyleElement {
    const linkEl = document.createElement("link");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.type = "text/css";
    linkEl.classList.add("style-manager-theme");
    linkEl.onload = (eventInfo) => {
      this.setLoadedStyleName(
        (eventInfo.currentTarget as HTMLStyleElement).dataset.styleName
      );

      if (this.callbackRefreshUI) {
        this.callbackRefreshUI();
      }
    };

    document.head.appendChild(linkEl);
    return linkEl;
  }

  static toThemeName(theme: string): string {
    for (const thm of Settings.applicationThemes) {
      if (thm.name.toLowerCase() === theme.toLowerCase()) {
        return thm.gxName + ".css";
      }
    }
    return theme + ".css";
  }
}

export class ApplicationThemeDefinition {
  name: string;
  gxName: string;
}
