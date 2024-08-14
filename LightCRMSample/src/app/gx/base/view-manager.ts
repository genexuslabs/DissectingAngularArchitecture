import { Observable, Subscription, fromEvent } from "rxjs";
import { Settings } from "app/app.settings";
import { GeneXusClientClientInformation } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/client/client-information";
import { ThemeManager } from "./theme-manager";

export enum NavigationStyle {
  Cascade = "cascade",
  Flip = "flip",
  Slide = "slide",
  Split = "split",
}

export class ViewManager {
  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  views: ComponentViewDefinition[] = [];
  view: string = null;
  type = "";

  oldMode = "";

  start(viewVariants: ComponentViewDefinition[]) {
    this.views = viewVariants || [];
    this.updateViewManager();
    this.resizeObservable = fromEvent(window, "resize");
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.updateViewManager();
    });
  }

  bindApplicationBar() {
    const currentView = this.selectView();
    if (currentView !== undefined) {
      if (currentView.appBarBindFn !== undefined) {
        const currentNavigationStyle = this.selectNavigationStyle(currentView);
        currentView.appBarBindFn(currentNavigationStyle);
      }
    }
  }

  update(m: string) {
    if (this.oldMode !== m) {
      this.type = m ? "edit" : "";    // Empty or null/undefined -> no mode -> ""
      this.updateViewManager();
      this.oldMode = m;
    }
  }

  updateViewManager() {
    const viewToSet = this.selectView();
    if (viewToSet !== undefined && viewToSet.name !== this.view) {
      // Set view to show
      this.view = viewToSet.name;
      // Set view theme
      const theme = viewToSet.theme;
      ThemeManager.setCurrentTheme(theme);
      ThemeManager.setStyle(theme);
    }
  }

  selectView() {
    const target = TargetViewDefinition.getPlatformInfo();
    return this.views
      .filter((platform) => this.type === platform.type || this.type === "")
      .filter((platform) => target.os === platform.os || platform.os === "Any Platform")
      .filter((platform) => target.device === platform.device || platform.device === "Any Device Kind")
      .find(viewMatchesViewport(target))
      || this.views[0];
  }

  selectNavigationStyle(currentView: ComponentViewDefinition) {
    return currentView !== undefined &&
      currentView.navigationStyle !== "default"
      ? currentView.navigationStyle
      : Settings.DEFAULT_NAVIGATION_STYLE;
  }

  end() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  getUIModelDefaults = (containerName?: string) => {
    const viewDef = this.getViewDefinition();
    if (viewDef !== undefined && viewDef.UIModelDefaults !== undefined) {
      return viewDef.UIModelDefaults(containerName);
    }
    return [];
  }

  getViewDefinition(): ComponentViewDefinition {
    return this.views.find((viewDef) => viewDef.name === this.view);
  }
}

const viewMatchesViewport = (target: TargetViewDefinition) => (platform: ViewBounds) => {
  const shortestBound = target.shortestBound;
  const longestBound = target.longestBound;
  return (
    (platform.minShortestBound > 0
      ? platform.minShortestBound < shortestBound
      : true) &&
    (platform.maxShortestBound > 0
      ? platform.maxShortestBound > shortestBound
      : true) &&
    (platform.minLongestBound > 0
      ? platform.minLongestBound < longestBound
      : true) &&
    (platform.maxLongestBound > 0
      ? platform.maxLongestBound > longestBound
      : true)
  );
};


export interface ViewBounds {
  minShortestBound: number;
  maxShortestBound: number;
  minLongestBound: number;
  maxLongestBound: number;
}

export interface ComponentViewDefinition extends ViewBounds {
  name: string;
  type: string;
  os: string;
  device: string;
  minShortestBound: number;
  maxShortestBound: number;
  minLongestBound: number;
  maxLongestBound: number;
  navigationStyle: string;
  appBarBindFn?: (navigationStyle: string) => void;
  UIModelDefaults?: (containerName?: string) => any;
  theme: string;
}

export interface ApplicationViewDefinition extends ViewBounds {
  navigationStyle: NavigationStyle | string;
}

export class TargetViewDefinition {
  os: string;
  device: string;
  shortestBound: number;
  longestBound: number;
  osVersion: string;
  orientation: string;

  static getPlatformInfo(): TargetViewDefinition {
    const plat = new TargetViewDefinition();
    // Get current platform info
    try {
      plat.os = GeneXusClientClientInformation.platformName().indexOf("Web") > -1 ? "Web" : "Any Platform";
      plat.device = GeneXusClientClientInformation.platformName() === "Web Mobile" ? "Phone or Tablet" : "Any Device Kind"; // "Any Device Kind" | "Phone or Tablet"
      plat.osVersion = GeneXusClientClientInformation.oSName() + " " + GeneXusClientClientInformation.oSVersion();
    } catch {
      plat.os = plat.os ?? "Any Platform";
      plat.device = plat.device ?? "Any Device Kind";
      plat.osVersion = plat.osVersion ?? " ";
    }

    // Get screen info
    const screenWidth = window.screen?.width ? window.screen?.width : window.innerWidth;
    const screenHeight = window.screen?.height ? window.screen?.height : window.innerHeight;
    plat.shortestBound = Math.min(screenWidth, screenHeight);
    plat.longestBound = Math.max(screenWidth, screenHeight);
    plat.orientation = screenWidth > screenHeight ? "Landscape" : "Portrait";

    return plat;
  }

}

