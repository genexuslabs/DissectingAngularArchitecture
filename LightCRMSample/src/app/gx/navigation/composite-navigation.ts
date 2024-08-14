import { Injectable, inject } from "@angular/core";
import { Subject } from "rxjs";
import { RouterNavigation } from "app/gx/navigation/router-navigation";
import { NavigationEvent } from "app/gx/navigation/navigation-event.dt";
import { NavigationHelper } from "app/gx/navigation/navigation-helper";
import { ActionState } from "app/gx/base/action-state.dt";
import { LocationStrategy } from "@angular/common";
import { link } from "@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/link";
import { PanelNavigationState } from "app/gx/navigation/panel-navigation-state.dt";
import { ActionsManager } from "app/gx/navigation/actions-manager"
import { UriService } from "./uri.service";
import { OutletNavigationToComponentInstance } from "./outlets-navigation-to-instance";

@Injectable({
  providedIn: "root",
})
/**
 * Class encapsulating routing, navigation and event state and resume management
 */
export class CompositeNavigation {
  // Navigation and events resume
  runningActionsManager = new ActionsManager();

  // Navigation location and state
  transientNavigationState: CompositeNavigationSnapshot;

  loadingStateChange$: Subject<boolean> = new Subject<boolean>();

  private uriService = inject(UriService);
  private routerNavigation = inject(RouterNavigation);
  private locationStrategy = inject(LocationStrategy);
  private nid2iid = inject(OutletNavigationToComponentInstance);

  constructor() {
    // Subscribe to router start/end navigation events to manage component state and events resume
    this.routerNavigation.navigationEvent$.subscribe(
      async (event: NavigationEvent) => {
        // Start navigation event
        if (event.type === "start") {
          if (!event.uri.startsWith("/(")) {
            this.loadingStateChange$.next(true);
          }
          this.transientNavigationState = new CompositeNavigationSnapshot(event);
          // Process navigation type
          if (event.trigger === "popstate") {   // browser back/forward navigation
            // Complete pending events in primary outlet
            const runningAction = event.nvgExtras;
            if (runningAction) {
              await this.completePendingActions(event.fromActionIID, event.fromActionId, event.fromActionOutlet, null);
            }
            // Set instances that must be restored from state in this navigation
            this.loadInstancesToRestore(event.id);

          } else if (event.trigger === "appback") {   // returning back from component
            // Complete pending events in secondary outlets
            const runningAction = event.nvgExtras;
            if (runningAction) {
              await this.completePendingActions(event.fromActionIID, event.fromActionId, event.fromActionOutlet, runningAction.outlet);
            }
            // Set instances that must be restored from state in this navigation
            this.loadInstancesToRestore(event.id);
          }
        }

        // End navigation event
        else if (event.type === "end") {
          if (!event.uri.startsWith("/(")) {
            this.loadingStateChange$.next(false);
          }
        }
      }
    );
  }

  async completePendingActions(returningToIID, returningToActionId, returningToOutlet, runningOutlet) {
    if (returningToOutlet !== runningOutlet) {
      // Pending action in a different outlet -> resume
      this.runningActionsManager.nextActionIdToComplete = returningToActionId;
      await this.runningActionsManager.resumePendingAction(returningToIID);
    } else {
      // Pending action in the same outlet -> schedule to resume when returning component is instantiated
      this.runningActionsManager.nextActionIdToComplete = returningToActionId;
    }
  }

  getNavigationSnapshot(): CompositeNavigationSnapshot {
    return this.transientNavigationState;
  }

  isPrimaryOutlet(): boolean {
    // Current outlet is primary?
    return this.transientNavigationState.outlet === null;

  }

  getAppExtras(name: string): any {
    return this.getNavigationSnapshot().getAppExtras(name);
  }


  pushNavigation(
    nvgCommand: Array<any>,
    nvgOutlet: string,
    nvgOptions: string,
    navigationStateSnapshot: CompositeNavigationSnapshot,
    params,
    stackBehavior) {
    // Push new navigation to outlet stack
    const navigationState = new PanelNavigationState();
    const runningAction: ActionState = navigationStateSnapshot.getRunningAction();
    if (runningAction) {
      navigationState.fromActionId = runningAction.actionId;
      navigationState.fromActionOutlet = runningAction.navigationState?.outlet;
      navigationState.fromActionIID = runningAction.iid;
      navigationState.fromActionNID = runningAction.nid;
    }

    navigationState.nid = navigationStateSnapshot.nid;
    navigationState.navigationCommand = nvgCommand;
    navigationState.outlet = nvgOutlet;

    if (!NavigationHelper.emptyParams(params)) {
      nvgCommand.push(params);
    }
    if (stackBehavior == 'replace') {
      this.replaceInOutlet(
        nvgOutlet,
        nvgCommand,
        nvgOptions,
        navigationState
      );
    } else if (stackBehavior == 'push') {
      this.pushToOutlet(
        nvgOutlet,
        nvgCommand,
        nvgOptions,
        navigationState
      );
    }
  }

  pushToOutlet(
    outlet: string,
    navigationCommand: any,
    options: string,
    navigationState: PanelNavigationState
  ) {
    this.routerNavigation.pushToOutlet(
      outlet,
      navigationCommand,
      options,
      navigationState
    );
  }

  replaceInOutlet(
    outlet: string,
    navigationCommand: any,
    options: string,
    navigationState: PanelNavigationState
  ) {
    this.routerNavigation.popFromOutlet(
      outlet,
    );

    this.routerNavigation.pushToOutlet(
      outlet,
      navigationCommand,
      options,
      navigationState
    );
  }

  canGoBack(): boolean {
    // Can go back in primary outlet?
    return this.routerNavigation.canGoBack(null);
  }

  /**
   * Starts to record action state of an event execution
   * @param iid panel instance ID where the action is starting to run
   * @param outlet outlet where the panel was activated
   */
  startAction(iid: number, outlet: string) {
    const act = new ActionState();
    const navigationState = this.routerNavigation.getNavigationState(outlet);
    act.iid = iid;
    act.navigationState = navigationState;
    act.nid = navigationState?.nid ?? 1;
    act.actionId = this.runningActionsManager.getNewActionId();
    return act;
  }

  /**
   * Process the end of an event execution
   * @param act
   *    action state
   */
  endAction(act: ActionState) {
    this.runningActionsManager.endEvent(act.iid, act.actionId);
  }

  /**
   * Set navogation options
   */
  navigateOption(optionTarget: any, optionName: string, optionValue: string) {
    this.routerNavigation.navigateOption(optionTarget, optionName, optionValue);
  }

  /**
   * Navigate to another panel
   */
  async navigate(nvgCommand: any, act?: ActionState): Promise<any> {
    return this.navigate_impl(nvgCommand, false, act, {});
  }

  /**
   * Navigate to another panel, waiting for navigated panel to return to continue execution
   */
  async navigateForResult(nvgCommand: any, act?: ActionState): Promise<any> {
    return this.navigate_impl(nvgCommand, true, act, {});
  }

  /**
   * Navigate to another panel, waiting for navigated panel to return to continue execution
   * Allows to send extra navigation info
   */
  async navigateForResultWithExtras(nvgCommand: any, extras: any, act?: ActionState): Promise<any> {
    return this.navigate_impl(nvgCommand, true, act, extras);
  }

  /**
   * Navigates to given route
   * @param nvgCommand
   *     Uri with route parameters
   *     Expected format = [ '<url>', {<parm1_name>:<parm1_value>, <parm2_name>:<parms_value>, ...}]
   * @param waitForResult
   *     Sets executing behavior:
   *         true = waits for target object return to complete
   *         false = completes depending on runtime contidions related to target outlet
   * @param act
   *      State of the action issuing the navigation command
   */
  async navigate_impl(
    nvgCommand: any,
    waitForResult: boolean,
    act: ActionState,
    appExtras: any
  ): Promise<any> {
    // Add info for navigation tracking
    const navigationExtras = this.routerNavigation.setNavigationExtras(act, appExtras, {});
    // Navigate
    const targetOutlet = await this.routerNavigation.navigate(
      nvgCommand,
      navigationExtras
    );
    if (waitForResult || this.mustWaitForOutlet(targetOutlet, act)) {
      // Sync navigation - navigates to target and waits for return to continue executing next statements
      return new Promise<any>(async (complete) => {
        const result = await this.runningActionsManager.waitForResult(act.iid, act.actionId);
        complete(result);
      });
    } else {
      // Async navigation - navigates to target and continues executing next statements
      return Promise.resolve();
    }
  }

  /**
   * Returns when the navigation must wait for the called objetc to return, to continue with action execution
   * @param targetOutlet
   *      Target outlet of navigation
   * @param act
   *      State of the action running
   */
  mustWaitForOutlet(targetOutlet: string, act: ActionState) {
    if (targetOutlet === "popup") {
      return true;
    } else if (
      act.navigationState &&
      targetOutlet === act.navigationState.outlet
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Navigates back to previous component, returning values and restoring outlets state
   * @param act
   *      State of the action running
   * @param result
   *      Result data to return
   */
  async back(act: ActionState, result: any = {}) {
    if (!act.navigationState) {
      // Action does not provide navigation state -> can't navigate back
      return;
    }

    // 1. Return data to pending component
    const pendingInstanceId = act.navigationState.fromActionIID;
    const pendingActionId = act.navigationState.fromActionId;
    this.runningActionsManager.saveResult(pendingInstanceId, pendingActionId, result);  // set return value

    // 2. Navigate back to previous component in running action outlet stack
    const actionOutlet = act.navigationState.outlet;
    await this.routerNavigation.navigateBack(actionOutlet, act);
  }

  backTo(url: string, act: ActionState): void {
    this.back(act, {});
  }

  goHome(act: ActionState): void {
    this.routerNavigation.navigateByUrl("/");
  }

  /**
   * hrefs to the given url
   */
  async link(url: string, ...parameters: string[]) {
    return link(await this.linkUrl(url, ...parameters));
  }

  /**
   * Normalize the given URL to a full URL
   * @param url 
   *      Url to link to
   * @param parameters 
   *      Parameters to send
   */
  async linkUrl(url: string, ...parameters: string[]) {
    const urlLower = url.toLowerCase();
    if (urlLower.startsWith("http://") || urlLower.startsWith("https://")) {
      return url;
    } else {
      const appBaseURL =
        window.location.origin + this.locationStrategy.getBaseHref();
      const route = await this.uriService.parseDynamicUrl(url);

      const parameterAux = [];
      if (parameters && parameters.length > 0) {
        parameters.forEach((parameter) => {
          parameterAux.push(encodeURIComponent(parameter));
        });
      }

      if (route) {
        const uriParams =
          parameterAux && parameterAux.length > 0
            ? ";_gxParameterValues=" + parameterAux.join(",")
            : "";
        return `${appBaseURL}${route[0]}${uriParams}`;
      } else {
        console.warn(`Could not link to ${url}`);
        return "";
      }
    }
  }

  /**
   * Converts the given url to an dynamic call spec, returning empty string if
   * the url can't be converted
   * @param url
   *      Url to convert to a dynamic call spec
   * @returns
   *      Returned format: 'sd:<module>.<object_name>?<encoded_parameters>' | ''
*/
  urlConvert(url: string) {
    return url ? this.linkToNavigationUrl(url) ?? url : "";
  }

  /**
   * Converts the given url to an dynamic call spec, returning NULL if the url can't be converted
   * @param url
   *      Url to convert to a navigable SD url
   */
  linkToNavigationUrl(url: string): string | null {
    const urlLower = url.toLowerCase();
    if (this.canNavigate(urlLower)) {
      const appBaseURL =
        window.location.origin + this.locationStrategy.getBaseHref();
      const aux = url.split(";_gxParameterValues=");
      const aux1 = aux[0]
        .replace(appBaseURL, "")
        .replace(/\//g, ".")
        .split("-")[0];
      if (aux[1]) {
        return "sd:" + aux1 + "?" + decodeURIComponent(aux[1]);
      } else {
        return "sd:" + aux1;
      }
    }
    return null;
  }

  /**
   * Can navigate to a packed component
   * @param url
   *      Url to check
   */
  canNavigate(url: string) {
    const urlLower = url.toLowerCase();
    const appBaseURL = window.location.origin + this.locationStrategy.getBaseHref();
    return (urlLower.startsWith("http://") || urlLower.startsWith("https://")) && urlLower.startsWith(appBaseURL.toLowerCase());
  }

  /**
   * Navigates to the given dynamic call spec 
   * @param callString
   *      Accepted format: '<module>.<object_name>?<encoded_parameters>'
   * @param parameters
   *      Call parameters, if there are parameters in both callString and parameters => all are included
   */
  async dynamicNavigate(act: any, target: string, ...parameters: string[]) {
    const [callString, callParameters] = await this.uriService.parseDynamicUrl(
      target,
      parameters
    );
    if (callParameters) {
      await this.navigate(
        [callString, { _gxParameterValues: callParameters }],
        act
      );
    } else {
      await this.navigate([callString], act);
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Instance state restoring when navigating
  //

  IIDsToRestore: Array<number>;   // Instance IIDs to restore when backnavigating
  /**
  * Set intances that must be restored given the current navigation to instnces map
  */
  loadInstancesToRestore(nid) {
    this.IIDsToRestore = this.nid2iid.getAllByNID(nid);
  }

  /**
  * Returns when the given instance must be retored on backnavigation
  */
  popInstanceToRestore(iid: number): boolean {
    const toRestore = this.IIDsToRestore;
    if (toRestore.indexOf(iid) > -1) {
      // Remove from restoring list
      const ix = toRestore.indexOf(iid);
      toRestore[ix] = toRestore[toRestore.length - 1];
      toRestore.pop();
      return true;
    }
    return false;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Helpers
  //

  /**
   * Get parameter value (by name or positional)
   * CONVENTION: a parameter with name "_gxParameterValues" denotes positional parameters (comma separated)
   * @param name
   * @param params
   * @param position
   */
  getParam(name: string, params: any, position?: number): any {
    if (params) {
      if (position && params["_gxParameterValues"]) {
        return params["_gxParameterValues"].split(",")[position - 1];
      }
      return params[name];
    }
    return null;
  }

  uriFromObject(objectName: string, ...parameters: any) {
    return NavigationHelper.uriFromObject(objectName, ...parameters);
  }

  emptyPrimaryOutlet(): boolean {
    return this.routerNavigation.getCurrentLocation().startsWith("?");
  }

  updateVerticalTargetsBreakpointMatched(isMatched: boolean) {
    this.routerNavigation.isVerticalTargetsBreakpointMatched = isMatched;
  }


}

/**
 * Transient state of the composite navigation
 */
export class CompositeNavigationSnapshot {
  nid: number; // Navigation id
  navigationCommand: any; // Navigation command
  outlet: any; // outlet
  outletActivation = {}; // outlet activation
  navigationTrigger: string; // event that triggered the navigation
  nvgExtras: any; // extra data required for navigation (runningAction)
  appExtras: any; // extra app data
  stackBehavior: string;  // navigation stack behavior (push, no-push, replace)

  constructor(event: NavigationEvent) {
    this.navigationCommand = event.navigationCommand;
    this.outlet = event.outlet;
    this.outletActivation[event.outlet] = event.trigger;
    this.stackBehavior = event.stackBehavior;
    this.nid = event.id;
    this.nvgExtras = event.nvgExtras;
    this.appExtras = event.appExtras;
    this.navigationTrigger = event.trigger;
  }

  /**
   *  Returns the current running action Id (stored in the extras field of the navigation state)
   */
  getRunningAction(): ActionState {
    return this.nvgExtras;
  }

  /**
   * Return the command issued to navigate to the current navigation state
   */
  getNavigationCommand(): Array<any> {
    return this.navigationCommand;
  }

  /**
   * Returns extra info bound to navigation event
   */
  getAppExtras(name: string): any {
    if (this.appExtras && this.appExtras[name]) {
      return this.appExtras[name];
    }
    return null;
  }

}
