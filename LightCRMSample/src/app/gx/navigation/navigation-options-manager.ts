import { Injectable } from "@angular/core";
import { NavigationExtras } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class NavigationOptionsManager {

  // Option IDs
  static TARGET_ID = 'target';
  static TARGET_SIZE_ID = 'targetsize';
  static TARGET_WIDTH_ID = 'targetwidth';
  static TARGET_HEIGHT_ID = 'targetheight';
  static TYPE_ID = 'type';

  // TYPE option values
  static TYPE_POPUP_ID = 'popup';
  static TYPE_REPLACE_ID = 'replace';
  static TYPE_CALLOUT_ID = 'callout';
  static TYPE_PUSH_ID = 'push';

  // TARGET_SIZE option values
  static TARGET_SIZE_SMALL_ID = 'small';
  static TARGET_SIZE_MEDIUM_ID = 'medium';
  static TARGET_SIZE_LARGE_ID = 'large';

  // Navigation options
  navigationOptions = {};

  set(optionTarget: any, optionName: string, optionValue: string) {
    const optionTargetId = this.normalizeOptionTarget(optionTarget);
    let optionId = optionName.toLowerCase();
    let optionValueId1 = optionValue ? optionValue.toLocaleLowerCase() : null;
    if (optionId === NavigationOptionsManager.TYPE_ID && (optionValueId1 === NavigationOptionsManager.TYPE_POPUP_ID || optionValueId1 === NavigationOptionsManager.TYPE_CALLOUT_ID)) {
      // obj.type = popup -> obj.target = 'popup'
      optionId = NavigationOptionsManager.TARGET_ID;
      optionValueId1 = NavigationOptionsManager.TYPE_POPUP_ID;
    }
    const optionKey = this.getOptionKey(optionTargetId, optionId);
    this.navigationOptions[optionKey] = optionValueId1
  }

  get(optionTarget: any, optionName: string): string {
    const optionTargetId = this.normalizeOptionTarget(optionTarget);
    const optionId = optionName.toLowerCase();
    const optionKey = this.getOptionKey(optionTargetId, optionId);
    return this.navigationOptions[optionKey];
  }

  clear(optionTarget: any) {
    const optionTargetId = this.normalizeOptionTarget(optionTarget);
    for (const optionKey in this.navigationOptions) {
      if (this.isOptionForTarget(optionKey, optionTargetId)) {
        this.navigationOptions[optionKey] = null;
      }
    }
  }

  getOutlet(url: string[]): string {
    const targetUri = url[0];
    if (typeof targetUri === "string") {
      // Target
      const optionTargetId = this.normalizeOptionTarget(url.join("/"));
      const optionKey = this.getOptionKey(optionTargetId, NavigationOptionsManager.TARGET_ID);
      const outlet = this.navigationOptions[optionKey];
      if (outlet) {
        this.navigationOptions[optionKey] = null; // release navigation option after usage
        return outlet;
      }
    }
    return null;
  }

  /**
   * Normalize input target, to obtain a unique tartget_name for option target identificacion, accepting formats:
   *    /<target_name>-<section>
   *    [<target_name>-<section>, <parameters>]
   * @param optionTarget 
   */
  normalizeOptionTarget(optionTarget: any): string {
    if (Array.isArray(optionTarget)) {
      // [<target_name>-<section>, <parameters>]
      if (optionTarget.length > 0) {
        const optionTarget1 = optionTarget[0];
        return this.normalizeOptionTarget( optionTarget1);
      }
    } else {
      // /<target_name>-<section>
      let optionTargetId = optionTarget;
      if (optionTargetId.startsWith("/")) {
        optionTargetId = optionTarget.substring(1);
      }
      if (optionTargetId.indexOf("-") >= 0) {
        return optionTargetId.substring(0, optionTargetId.indexOf("-"));
      }
      return optionTargetId;
    }
  }

  getOptionKey(optionTargetId: string, optionId: string): any {
    return optionTargetId.toLowerCase() + "__" + optionId.toLowerCase();
  }

  isOptionForTarget(optionTargetFound: string, optionTargetId: string) {
    const key = this.getOptionKey(optionTargetId, "");
    return optionTargetFound.startsWith(key);
  }

  processNavigationOptionsExtras(url: string, nvgExt: NavigationExtras = {}): any {
    // CallType
    if (this.isNavigationReplace(url)) {
      nvgExt.replaceUrl = true;
    }
    // Append query ID
    return this.appendIdToQueryParams(nvgExt);
  }

  isNavigationReplace(optionTarget): boolean {
    const optionTargetId = this.normalizeOptionTarget(optionTarget);
    const optionKey = this.getOptionKey(optionTargetId, NavigationOptionsManager.TYPE_ID)
    return this.navigationOptions[optionKey] === NavigationOptionsManager.TYPE_REPLACE_ID;
  }

  appendIdToQueryParams(nvgExt: NavigationExtras) {
    const rnd = Math.floor(Math.random() * 1000 + 1);
    if (!nvgExt) {
      nvgExt = { queryParams: { _id: rnd } };
    } else if (nvgExt.queryParams) {
      nvgExt.queryParams = { _id: rnd };
    }
    return nvgExt;
  }

  processOutletOptions(outlet: string, url: string): OutletOptions {
    const options = new OutletOptions();
    options.size = this.get(url, NavigationOptionsManager.TARGET_SIZE_ID);
    options.width = OutletOptions.convertSize(this.get(url, NavigationOptionsManager.TARGET_WIDTH_ID));
    options.height = OutletOptions.convertSize(this.get(url, NavigationOptionsManager.TARGET_HEIGHT_ID));
    return options;
  }

}

export class OutletOptions {
  size: string;
  width: string;
  height: string;

  static convertSize(s: string): string {
    return s ? s.replace("dip", "px") : null;
  }
}
