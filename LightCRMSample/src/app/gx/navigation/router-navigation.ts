import { inject, Injectable } from "@angular/core";;
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  ActivatedRoute,
  NavigationSkipped,
} from "@angular/router";
import { NavigationOptionsManager } from "app/gx/navigation/navigation-options-manager";
import { Location } from "@angular/common";
import { Subject } from "rxjs";
import { NavigationEvent } from "app/gx/navigation/navigation-event.dt";
import { ActionState } from "../base/action-state.dt";
import { OutletsNavigation, OutletHistoryData } from "./outlets-navigation";
import { PanelNavigationState } from "./panel-navigation-state.dt";
import { NavigationHelper } from "./navigation-helper";

@Injectable({
  providedIn: "root",
})
/**
 * Angular routing to app routing
 */
export class RouterNavigation {
  navigationEvent$: Subject<any> = new Subject<any>();

  routerEvents: RouterEventsManager;
  routerState: RouterState;

  isVerticalTargetsBreakpointMatched: boolean;

  private outletsNavigation = inject(OutletsNavigation);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private nvgOptsMngr = inject(NavigationOptionsManager);
  private router = inject(Router);

  private hid2nid = {};


  constructor() {

    this.routerState = new RouterState(this.router);
    this.routerEvents = new RouterEventsManager(this.routerState);

    // Start router events subscription to process navigation events
    this.router.events.subscribe((event: Event) => {
      const eventid = this.fixNID(event);
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === "popstate") {
          const nvgData = this.setupHistoryTransientState(eventid);
          this.navigationEvent$.next(this.routerEvents.startEvent(event, eventid, RouterState.getTransientState(), nvgData, {}));

        } else {
          const nvgData = this.routerState.getCurrentNavigationExtras("nvg");  // Get navigation state
          const appData = this.routerState.getCurrentNavigationExtras("app");  // Get app state
          this.navigationEvent$.next(this.routerEvents.startEvent(event, eventid, RouterState.getTransientState(), nvgData, appData));

        }
      } else if (event instanceof NavigationEnd || event instanceof NavigationSkipped) {
        const endEvent = this.routerEvents.endEvent(event, eventid, RouterState.getTransientState());
        this.outletsNavigation.renderOutletsInUrl(endEvent.uri, endEvent.outlet, this.isVerticalTargetsBreakpointMatched);
        this.navigationEvent$.next(endEvent);

      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.navigationEvent$.next(this.routerEvents.endEvent(event, eventid, RouterState.getTransientState()));

      }
    });
  }

  /**
   * This router keeps the navigagation ID stable when back/forward and imperative-back navigating. It should only advance 
   * the navigation number when imerative-forward navigating. 
   * 
   * To keep the navigation ID after history traversal and imperative-back navigations, the navigation ID must be fixed.
   * 
   * @param event
   */
  fixNID(event) {
    const routerTransientState = RouterState.getTransientState();
    let historyNID = event.id;
    if (event.navigationTrigger === "popstate") {
      historyNID = event.restoredState?.navigationId ?? event.id;

    } if (routerTransientState.isImperativeBack) {
      historyNID = routerTransientState?.fromActionNID ?? event.id;

    }
    if (this.hid2nid[historyNID]) {
      historyNID = this.hid2nid[historyNID];

    }
    this.hid2nid[event.id] = historyNID;
    return historyNID;
  }

  navigateOption(optionTarget: any, optionName: string, optionValue: string) {
    this.nvgOptsMngr.set(optionTarget, optionName, optionValue);
  }

  async navigate(nvgCommand: any, navigationExtras?: any): Promise<any> {
    // Find target outlet
    const currentOutlet = navigationExtras.state.nvg.navigationState?.outlet;
    const stackBehavior = this.navigationStackBehavior(nvgCommand[0]);
    const targetOutlet =
      this.nvgOptsMngr.getOutlet(nvgCommand) ||
      (currentOutlet === "popup" ? "popup" : null);
    const targetOutletOptions = this.nvgOptsMngr.outletOptionsToString(
      nvgCommand[0]
    );
    // Sets transient navigation state
    const transientState = new RoutingTransientState(
      nvgCommand,
      targetOutlet,
      false,
      0,
      stackBehavior
    );
    RouterState.setTransientState(transientState);
    // Starts navigation
    await this.navigate_impl(
      nvgCommand,
      targetOutlet,
      targetOutletOptions,
      navigationExtras
    );
    // Reset navigation options
    this.nvgOptsMngr.clear(nvgCommand[0]);
    return Promise.resolve(targetOutlet);
  }

  navigationStackBehavior(optionTarget) {
    if (this.nvgOptsMngr.isNavigationReplace(optionTarget)) {
      return 'replace';
    } else if (this.nvgOptsMngr.isNavigationIgnore(optionTarget)) {
      return 'no-push';
    } else {
      return 'push';
    }
  }

  setupHistoryTransientState(eventid) {
    const outlet = null;  // main outlet

    // Find if we are goning back or forward in the navigation history
    const popNavigationState = this.outletsNavigation.getPopNavigationState(outlet);
    const outletStackNID = popNavigationState?.nid;
    const historyNID = eventid;

    if (outletStackNID === historyNID) {
      // Going back thru history
      const currentNavigationState = this.outletsNavigation.getNavigationState(outlet);

      // Create transient state for back navigation
      const restoringOutletData = this.outletsNavigation.popFromOutlet(null); // pop previous component in running action outlet
      const nvgCommand = restoringOutletData.url;
      const transientState = new RoutingTransientState(nvgCommand, outlet, false, outletStackNID, 'no-push');
      if (currentNavigationState) {
        // Add returning action info to transient routing state
        transientState.fromActionIID = currentNavigationState.fromActionIID;
        transientState.fromActionId = currentNavigationState.fromActionId;
        transientState.fromActionOutlet = currentNavigationState.fromActionOutlet;
      }
      transientState.isForwardNavigation = false;
      RouterState.setTransientState(transientState);
      const act = new ActionState();
      act.navigationState = currentNavigationState;
      return act;

    } else {
      // Going forward thru history
      const currentNavigationState = this.outletsNavigation.getNavigationState(outlet);
      const nvgCommand = [];
      const transientState = new RoutingTransientState(nvgCommand, outlet, false, historyNID, 'push');
      if (currentNavigationState) {
        // Add returning action info to transient routing state
        transientState.fromActionIID = currentNavigationState.fromActionIID;
        transientState.fromActionId = currentNavigationState.fromActionId;
        transientState.fromActionOutlet = currentNavigationState.fromActionOutlet;
      }
      transientState.isForwardNavigation = true;
      RouterState.setTransientState(transientState);
      const act = new ActionState();
      act.navigationState = currentNavigationState;
      return act;

    }
  }

  async navigateBack(
    outlet: string,
    actionState?: ActionState
  ) {

    if (!outlet) {
      // Is primary outlet -> go back thru history navigation
      this.location.back();
    } else {
      // Is secondary outlet -> go back thru outlet stack
      const restoringOutletData = this.outletsNavigation.popFromOutlet(outlet); // previous component in running action outlet
      const nvgCommand = restoringOutletData.url;
      const outletOptions = restoringOutletData.options;
      const fromNID = actionState.navigationState.fromActionNID;

      // Add returning action info to transient routing state
      const transientState = new RoutingTransientState(nvgCommand, outlet, true, fromNID, 'no-push');
      transientState.fromActionIID = actionState.navigationState.fromActionIID;
      transientState.fromActionId = actionState.navigationState.fromActionId;
      transientState.fromActionOutlet = actionState.navigationState.fromActionOutlet;
      const navigationExtras = this.setNavigationExtras(actionState, {}, {})
      RouterState.setTransientState(transientState);
      await this.navigate_impl(
        nvgCommand,
        outlet,
        outletOptions,
        navigationExtras
      );
    }
  }

  async navigate_impl(
    nvgCommand: any,
    outlet: string,
    outletOptions: string,
    navigationExtras?: any
  ): Promise<boolean> {
    let targetUrl = nvgCommand;
    // Setup navigation options CallOptions, Id, Querystring
    let nvgExt = this.nvgOptsMngr.processNavigationOptionsExtras(
      nvgCommand[0],
      navigationExtras
    );
    if (outlet) {  // Secondary outlet navigation
      navigationExtras.replaceUrl = true;
      this.outletsNavigation.setState(outlet, nvgCommand, outletOptions);
      // Modify a QS parameter to enforce a navigation event in the router 
      targetUrl = this.activatedRoute.snapshot.url;
      nvgExt = NavigationHelper.addQueryParams(nvgExt, { "_outlets_navigation": "" + Math.trunc(Math.random() * 100000) });
    } else {
      targetUrl = nvgCommand;
      nvgExt = NavigationHelper.addQueryParams(nvgExt, this.activatedRoute.snapshot.queryParams);
    }

    targetUrl = this.normalizeRoute(targetUrl);
    // Invalid URL
    if (targetUrl.length > 0 && targetUrl[0].length === 0) {
      return Promise.reject("Cannot navigate to an empty URL");
    }
    // Navigate
    return this.router.navigate(targetUrl, nvgExt);
  }

  navigateByUrl(url: string, navigationExtras?: any) {
    this.router.navigateByUrl(url, navigationExtras);
  }

  getCurrentLocation(): string {
    return this.location.path();
  }

  setNavigationExtras(
    nvgData: any,
    appData: any,
    navigationExtras: any = {}
  ): any {
    let navigationExtras1 = this.addNavigationExtras(
      "nvg",
      nvgData,
      navigationExtras
    );
    navigationExtras1 = this.addNavigationExtras(
      "app",
      appData,
      navigationExtras1
    );
    return navigationExtras1;
  }

  private addNavigationExtras(
    dataName: string,
    dataContent: any,
    navigationExtras: any
  ): any {
    if (!navigationExtras) {
      navigationExtras = { state: {} };
    } else if (!navigationExtras.state) {
      navigationExtras.state = {};
    }
    navigationExtras.state[dataName] = dataContent;
    return navigationExtras;
  }

  private normalizeRoute(targetUri: any): any {
    const uriSegments = this.normalizeRouteCommands(targetUri);
    return uriSegments.filter((x) => x !== null);
  }

  private normalizeRouteCommands(cmds: Array<any>): Array<any> {
    let newCmds = [];
    for (const cmd of cmds) {
      if (typeof cmd === "string") {
        newCmds = newCmds.concat(cmd.split("/")); // path as string
      } else {
        newCmds.push(cmd); // other parameters
      }
    }
    return newCmds;
  }

  // Direct state access !!!!
  pushToOutlet(
    outlet: string,
    navigationCommand: any,
    options: string,
    navigationState: PanelNavigationState
  ) {
    this.outletsNavigation.pushToOutlet(
      outlet,
      navigationCommand,
      options,
      navigationState
    );
  }

  popFromOutlet(
    outlet: string,
  ) {
    this.outletsNavigation.popFromOutlet(
      outlet,
    );
  }

  canGoBack(outlet): boolean {
    // Can go back in primary outlet?
    return this.outletsNavigation.canGoBack(outlet);
  }

  getNavigationState(outlet) {
    return this.outletsNavigation.getNavigationState(outlet);
  }

}

class RoutingTransientState {
  isImperativeBack: boolean;
  navigationCommand: any;
  outlet: any;
  isForwardNavigation: boolean;
  stackBehavior: string

  fromActionId: number;
  fromActionOutlet: string;
  fromActionIID: number;
  fromActionNID: number;

  constructor(
    navigationCommand: any,
    outlet: string,
    isImperativeBack: boolean,
    fromActionNID: number,
    stackBehavior: string
  ) {
    this.navigationCommand = navigationCommand;
    this.outlet = outlet;
    this.isImperativeBack = isImperativeBack;
    this.fromActionNID = fromActionNID;
    this.stackBehavior = stackBehavior;
  }
}


class RouterEventsManager {

  routerState: RouterState;
  currentLocation: string;

  constructor(routerState: RouterState) {
    this.routerState = routerState;
  }

  startEvent = (event: NavigationStart, eventid: number, routerTransientState: RoutingTransientState, nvgData, appData): NavigationEvent => {
    // Process changing location
    if (this.currentLocation !== event.url) {

      // Update location state and raise a navigation event
      this.currentLocation = event.url;
      let navigationEvent: NavigationEvent;

      if (event.navigationTrigger === "popstate") {
        // browser back/forward navigation
        navigationEvent = this.createPopstateNavigationEvent(event, eventid, routerTransientState, nvgData, appData);

      } else if (routerTransientState.isImperativeBack) {
        // app return/cancel
        navigationEvent = this.createAppbackNanavigationEvent(event, eventid, routerTransientState, nvgData, appData);

      } else {
        // app forward navigation
        navigationEvent = this.createImperativeNavigationevent(event, eventid, routerTransientState, nvgData, appData);

      }
      return navigationEvent;
    }
  }

  createNavigationEvent = (event: NavigationStart, eventid: number, routerTransientState: RoutingTransientState) => {
    const navigationEvent = new NavigationEvent();
    navigationEvent.type = "start";
    navigationEvent.id = eventid;
    navigationEvent.uri = event.url;
    navigationEvent.trigger = event.navigationTrigger;
    navigationEvent.navigationCommand =
      routerTransientState.navigationCommand
        ? routerTransientState.navigationCommand
        : [""];
    navigationEvent.outlet = routerTransientState.outlet
      ? routerTransientState.outlet
      : null;
    return navigationEvent;
  }

  createPopstateNavigationEvent = (event: NavigationStart, eventid: number, routerTransientState: RoutingTransientState, nvgData, appData) => {
    // browser back/forward navigation
    const navigationEvent = this.createNavigationEvent(event, eventid, routerTransientState);
    navigationEvent.trigger = "popstate";
    navigationEvent.fromActionIID = routerTransientState.fromActionIID;
    navigationEvent.fromActionId = routerTransientState.fromActionId;
    navigationEvent.fromActionOutlet = routerTransientState.fromActionOutlet;
    navigationEvent.nvgExtras = nvgData;
    navigationEvent.appExtras = appData;
    navigationEvent.restoredId = routerTransientState.fromActionNID;
    navigationEvent.stackBehavior = routerTransientState.stackBehavior;
    return navigationEvent;
  }

  createAppbackNanavigationEvent = (event: NavigationStart, eventid: number, routerTransientState: RoutingTransientState, nvgData, appData) => {
    // app return/cancel
    const navigationEvent = this.createNavigationEvent(event, eventid, routerTransientState);
    navigationEvent.trigger = "appback";
    navigationEvent.fromActionIID = routerTransientState.fromActionIID;
    navigationEvent.fromActionId = routerTransientState.fromActionId;
    navigationEvent.fromActionOutlet = routerTransientState.fromActionOutlet;
    navigationEvent.nvgExtras = nvgData;
    navigationEvent.appExtras = appData;
    navigationEvent.restoredId = routerTransientState.fromActionNID;
    navigationEvent.stackBehavior = routerTransientState.stackBehavior;
    return navigationEvent;
  }

  createImperativeNavigationevent = (event: NavigationStart, eventid, routerTransientState: RoutingTransientState, nvgData, appData) => {
    const navigationEvent = this.createNavigationEvent(event, eventid, routerTransientState);
    navigationEvent.trigger = "imperative";
    navigationEvent.nvgExtras = nvgData;
    navigationEvent.appExtras = appData;
    navigationEvent.stackBehavior = routerTransientState.stackBehavior ?? 'push';
    return navigationEvent;
  }

  endEvent = (event: NavigationEnd | NavigationCancel | NavigationError | NavigationSkipped, eventid: number, routerTransientState: RoutingTransientState) => {
    const navigationEvent = new NavigationEvent();
    navigationEvent.type = "end";
    navigationEvent.uri = event.url;
    navigationEvent.id = eventid;
    navigationEvent.outlet = routerTransientState.outlet ? routerTransientState.outlet : null;
    return navigationEvent;
  }

}

class RouterState {
  private router;

  private static transientState = {};

  constructor(router: Router) {
    this.router = router;
  }

  getCurrentNavigationExtras(dataName: string): any {
    const currentNavigation = this.router.getCurrentNavigation();
    if (
      currentNavigation &&
      currentNavigation.extras &&
      currentNavigation.extras.state &&
      currentNavigation.extras.state[dataName]
    ) {
      return currentNavigation.extras.state[dataName];
    } else {
      return {};
    }
  }

  static getTransientState(): any {
    return this.transientState;
  }

  static setTransientState(state: RoutingTransientState) {
    this.transientState = state;
  }
}