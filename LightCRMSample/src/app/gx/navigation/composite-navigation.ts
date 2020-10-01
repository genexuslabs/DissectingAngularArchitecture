import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { LazyLoaderService } from 'app/gx/base/lazy-loader.service';
import { NavigationOptionsManager } from "app/gx/navigation/navigation-options-manager";
import { RouterNavigation } from "app/gx/navigation/router-navigation";
import { NavigationEvent } from "app/gx/navigation/navigation-event.dt";
import { NavigationHelper } from "app/gx/navigation/navigation-helper";
import { NavigationState, IStateContainer } from "app/gx/navigation/navigation-state";
import { OutletsNavigation } from "app/gx/navigation/outlets-navigation";
import { ActionState } from 'app/gx/base/action-state.dt';


@Injectable({
  providedIn: "root"
})
/**
 * Class encapsulating routing, navigation and event state and resume management 
 */
export class CompositeNavigation {

  // Navigation and events resume
  runningActionsManager = new CompositeActionsManager();

  // Navigation location and state
  activeState: NavigationState = new NavigationState();     // Components state
  NID2IID = [];

  current = new CompositeNavigationState();   // current navigation state

  loadingStateChange$: Subject<boolean> = new Subject<boolean>();
  isVerticalTargetsBreakpointMatched: boolean;

  constructor(
    private loader: LazyLoaderService,
    private nvgOptsMngr: NavigationOptionsManager,
    private routerNavigation: RouterNavigation,
    private outletsNavigation: OutletsNavigation,

  ) {

    // Subscribe to router start/end navigation events to manage component state and events resume
    this.routerNavigation.navigationEvent$.subscribe(async (event: NavigationEvent) => {

      // Start navigation event
      if (event.type === 'start') {
        if (!event.uri.startsWith("/(")) {
          this.loadingStateChange$.next(true);
        }
        this.current.navigationCommand = event.navigationCommand;
        this.current.outlet = event.outlet;
        this.current.nid = event.id;
        this.current.nvgExtras = event.nvgExtras;
        this.current.appExtras = event.appExtras;
        this.current.navigationTrigger = event.trigger;
        this.current.backNID = event.restoredId;
        // Process navigation type
        if (event.trigger === 'popstate') {
          // browser back/forward navigation
        }
        else if (event.trigger === 'appback') {
          // returning back from component -> must complete pending events
          const runningAction = event.nvgExtras;
          if (runningAction.actionId) {
            await this.runningActionsManager.resumePendingEvent(runningAction.navigationState.fromAction.actionId);
          }
        }
      }

      // End navigation event
      else if (event.type === 'end') {
        const activatedOutlets = this.outletsNavigation.loadSecondaryOutlets(event.uri);
        if (this.isVerticalTargetsBreakpointMatched) {
          // show target outlet
          if (event.outlet === null && !this.outletsNavigation.hasContentInPrimaryOutlet(event.uri)) {
            // Targets prtimary outlet it has NO content -> defaults to showing all active secondary outlets
            for (const outlet of activatedOutlets) {
              this.outletsNavigation.showOutlet(outlet);
            }
          } else {
            // Show target outlet
            this.outletsNavigation.showOutlet(event.outlet);
          }
        } else {
          // show all active outlets
          for (const outlet of activatedOutlets) {
            this.outletsNavigation.showOutlet(outlet);
          }
        }

        if (!event.uri.startsWith("/(")) {
          this.loadingStateChange$.next(false);
        }
      }
    });
  }

  pushToOutlet(nid: number, outlet: string, navigationCommand: any) {
    this.outletsNavigation.pushToOutlet(nid, outlet, navigationCommand);
  }

  /**
   * Save component <comp> state and sets a reference nid -> iid for 
   * restoring it during back navigation
   * @param componentName
   * @param outletName
   * @param nid
   * @param comp
   */
  saveState(componentName: string, outletName: string, nid: number, comp: IStateContainer) {
    this.NID2IID.push({
      nid: nid,
      name: componentName,
      outlet: outletName,
      iid: comp._navigation.iid
    });
    this.activeState.save(comp._navigation.iid, comp);
  }

  /**
   * Restores component <comp> state it had before navigation <nid>
   * @param componentName
   * @param outletName
   * @param nid
   * @param comp
   */
  restoreState(componentName: string, outletName: string, nid: number, comp: IStateContainer) {
    let i = this.NID2IID.length - 1;
    while (i >= 0) {
      const c = this.NID2IID[i];
      if (c.nid <= nid && c.name === componentName && c.outlet === outletName) {
        return this.activeState.restore(c.iid, comp);
      }
      i--;
    }
  }

  /**
   * Process the end of an event execution
   * @param act
   *    action state
   */
  endAction(act: ActionState) {
    this.runningActionsManager.endEvent(act.actionId);
  }

  /**
   * Checks for back or popstate navigation
   */
  restoringComponent(): boolean {
    return this.current.navigationTrigger === 'popstate' || this.current.navigationTrigger === 'appback';
  }

  /**
   * When back or popstate navigation, it returns the navigation ID of the returning navigation
   */
  getRestoringNID(): number {
    return this.current.backNID;
  }

  /**
  *  Returns the current running action (stored in the extras field of the navigation state)
  */
  getRunningAction(): ActionState {
    return this.current.nvgExtras;
  }

  /**
   * Return the command issued to navigate to the current navigation state
   */
  getNavigationCommand(): number {
    return this.current.navigationCommand;
  }

  /**
   * Returns the current navigation id
   */
  getNavigationId(): number {
    return this.current.nid;
  }

  navigateOption(optionTarget: any, optionName: string, optionValue: string) {
    this.nvgOptsMngr.set(optionTarget, optionName, optionValue);
  }

  async navigate(nvgCommand: any, act?: ActionState): Promise<any> {
    return this.navigate_impl(nvgCommand, false, act, {});
  }

  async navigateForResult(nvgCommand: any, act?: ActionState): Promise<any> {
    return this.navigate_impl(nvgCommand, true, act, {});
  }

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
  async navigate_impl(nvgCommand: any, waitForResult: boolean, act: ActionState, appExtras: any): Promise<any> {
    // Find target outlet
    const targetOutlet = this.nvgOptsMngr.getOutlet(nvgCommand);
    // Add info for navigation tracking
    const navigationExtras = this.routerNavigation.setNavigationExtras(act, appExtras, {});
    // Navigate
    await this.routerNavigation.navigate(nvgCommand, targetOutlet, navigationExtras);
    this.nvgOptsMngr.clear(nvgCommand[0]);
    if (waitForResult || this.mustWaitForOutlet(targetOutlet, act)) {
      // Sync navigation - navigates to target and waits for return to continue executing next statements
      return new Promise<any>(async (complete) => {
        let result = await this.runningActionsManager.waitForResult(act.actionId);
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
    if (targetOutlet === 'popup') {
      return true;
    }
    else if (act.navigationState && targetOutlet === act.navigationState.outlet) {
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
    // 1. Setup back navigation
    const currentNID = act.navigationState.nid;         // running action navigation id
    const currentOutlet = act.navigationState.outlet;   // outlet of current running action component
    // 2. Return data to calling component
    if (currentNID) {
      const currNvgEvt = this.routerNavigation.getNavigationEvent(currentNID);
      if (currNvgEvt) {
        // get the calling action that we must return to
        const runningAction = currNvgEvt.nvgExtras;
        // set return value
        this.runningActionsManager.saveResult(runningAction.actionId, result);
      }
    }
    // 3. Navigate back to previous component in outlet
    const restoringOutlet = this.outletsNavigation.popFromOutlet(currentOutlet)    // previous component in current outlet
    const navigationExtras = this.routerNavigation.setNavigationExtras(act, {}, {});
    await this.routerNavigation.navigateBack(restoringOutlet.url, currentOutlet, restoringOutlet.navigationId, navigationExtras);
  }

  backTo(url: string, act: ActionState): void {
    this.back(act, {});
  }

  goHome(act: ActionState): void {
    this.routerNavigation.navigateByUrl("/");
  }

  /**
   * Dynamic call, accepting parameters included in target string and/or in the parameters array
   * @param target 
   *      Call string
   * @param act
   *      State of the action issuing this navigation
   * @param parameters
   *      Added parameters
   */
  async dynamicCall(act: any, target: string, ...parameters: string[]) {
    const route = await this.parseDyncall(target, parameters);
    if (route.length > 1 && route[1]) {
      await this.navigate([route[0], { _gxParameterValues: route[1] }], act);
    } else {
      await this.navigate([route[0]], act);
    }

  }

  /**
   * Parse dynmamic call string
   * @param callString 
   *      Accepted format: ['sd:']'<module>.<object_name>' | ['sd:']'<module>.<object_name>?<encoded_parameters>'
   * @param parameters 
   *      Call parameters, if there are parameters in both callString and parameters => all are included
   */
  async parseDyncall(callString: string, parameters?: string[]): Promise<Array<any>> {
    // Parse 'sd' prefix
    let startUri = callString.indexOf("sd:");
    startUri = startUri >= 0 ? startUri + 2 : -1;
    // Normalize parameters
    let uriParams = parameters ? parameters.join(",") : "";
    let endUri = callString.indexOf("?");
    if (endUri >= 0) {
      // Found parameters included in callString
      uriParams =
        this.decodeURI_ex(callString.substring(endUri + 1)) + uriParams;
    } else {
      endUri = callString.length;
    }
    let uri = callString.substring(startUri + 1, endUri);
    uri = uri.replace(/\./g, "/");
    uri = await this.loader.findComponentRoute(uri);
    return [uri, uriParams];
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
    if (position && params["_gxParameterValues"]) {
      return this.getParamFromGxParameter(params["_gxParameterValues"], position);
    }
    return params[name];
  }

  getAppExtras(name: string): any {
    if (this.current.appExtras && this.current.appExtras[name]) {
      return this.current.appExtras[name];
    }
    return null;
  }

  getParamFromGxParameter(params: string, position: number): string {
    return params.split(",")[position - 1];
  }

  uriFromObject(objectName: string, ...parameters: any) {
    return NavigationHelper.uriFromObject(objectName, ...parameters);
  }

  decodeURI_ex(uri) {
    return decodeURI(uri.replace(/\+/g, "%20"));
  }

  emptyPrimaryOutlet(): boolean {
    return this.routerNavigation.getCurrentLocation().startsWith("?");
  }

  updateVerticalTargetsBreakpointMatched(isMatched: boolean) {
    this.isVerticalTargetsBreakpointMatched = isMatched;
  }
}

/**
 * Encapsulates running actions syncronization and behaviour
 */
class CompositeActionsManager {
  pendingNavigations = {};
  completedEvents = {};
  navigationResult = {};

  /**
   * Saves result to be returned given action
   * @param actionId
   *      Id of the awaiting action
   * @param result 
   *      Data to return
   */
  saveResult(actionId: number, result) {
    this.navigationResult[actionId] = result;
  }

  /**
   * Waits for result to continue executing the async event
   * @param actionId 
   *      Id of the awaiting action
   */
  async waitForResult(actionId: number): Promise<any> {
    return new Promise<any>((complete) => {
      let pendingNavigation = this.pendingNavigations[actionId];
      if (!pendingNavigation) {
        pendingNavigation = new Subject<any>();
        this.pendingNavigations[actionId] = pendingNavigation;
      }
      pendingNavigation.subscribe((result) => {
        complete(result)
      });

    });
  }

  /**
   * Waits for action to complete and resumes actions in 'waitForResult'
   * @param actionId 
   *      Id of the action to resume
   */
  async resumePendingEvent(actionId: number): Promise<any> {
    return new Promise((complete) => {
      const pendingEvent = this.pendingNavigations[actionId];
      if (pendingEvent) {
        this.pendingNavigations[actionId] = null;
        const result = this.navigationResult[actionId];
        pendingEvent.next(result);
        pendingEvent.complete();
        let completedEvent = this.completedEvents[actionId];
        if (!completedEvent) {
          completedEvent = new Subject<any>();
          this.completedEvents[actionId] = completedEvent;
        }
        completedEvent.subscribe((result) => {
          complete(result)
        });
      } else {
        complete();
      }
    });
  }

  /**
   * Completes pending action execution
   * @param backTo 
   */
  endEvent(actionId: number) {
    const completedEvent = this.completedEvents[actionId];
    if (completedEvent) {
      completedEvent.next(actionId);
      completedEvent.complete(actionId);
    }
  }

  lastNbr = 0;
  getNextId(): number {
    return this.lastNbr++;
  }
}

/**
 * Transient state of the composite navigation
 */
class CompositeNavigationState {
  nid: number;               // Navigation id
  navigationCommand: any;    // Navigation command
  outlet: any;               // outlet
  navigationTrigger: string; // event that triggered the navigation
  backNID: number;           // when back or popstate: id of the restoring navigation
  nvgExtras: any;            // extra data required for navigation (runningAction)
  appExtras: any;            // extra app data
}
