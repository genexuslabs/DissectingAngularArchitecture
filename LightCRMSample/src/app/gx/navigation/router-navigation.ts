import { Injectable } from "@angular/core";
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from "@angular/router";
import { NavigationOptionsManager } from "app/gx/navigation/navigation-options-manager";
import { Location } from "@angular/common";
import { Subject } from "rxjs";
import { NavigationEvent } from "app/gx/navigation/navigation-event.dt";
import { OutletsHelper } from "app/gx/navigation/outlets-helper";

@Injectable({
  providedIn: "root"
})
/**
 * Angular routing to app routing interface
 */
export class RouterNavigation {

  defaultSegment = 'app';

  currentLocation: string;
  navigationEvent$: Subject<any> = new Subject<any>();
  nidToNavigationEvent = {};

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private nvgOptsMngr: NavigationOptionsManager,
    private router: Router,
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

        // Process changing location
        if (this.currentLocation !== event.url) {

          const nvgData = this.getCurrentNavigationExtras('nvg');
          const appData = this.getCurrentNavigationExtras('app');
          const routerTransientState = this.getCurrentNavigationExtras('transient');

          // Update location state
          this.currentLocation = event.url;
          const navigationEvent = new NavigationEvent();
          navigationEvent.type = 'start';
          navigationEvent.id = event.id;
          navigationEvent.uri = event.url;
          navigationEvent.trigger = event.navigationTrigger;
          navigationEvent.navigationCommand = routerTransientState.navigationCommand ? routerTransientState.navigationCommand : [""];
          navigationEvent.outlet = routerTransientState.outlet ? routerTransientState.outlet : null;
          if (event.navigationTrigger === 'popstate') {   // browser back/forward navigation
            navigationEvent.trigger = 'popstate';
            const popNavigationEvent = this.nidToNavigationEvent[event.restoredState.navigationId];
            navigationEvent.nvgExtras = popNavigationEvent.nvgExtras;
            navigationEvent.appExtras = popNavigationEvent.appExtras;
            navigationEvent.restoredId = event.restoredState.navigationId;
            this.nidToNavigationEvent[navigationEvent.id] = navigationEvent;
          }
          else if (routerTransientState.isBackNavigation) {   // app return/cancel
            navigationEvent.trigger = 'appback';
            navigationEvent.nvgExtras = nvgData;
            navigationEvent.appExtras = appData;
            navigationEvent.restoredId = routerTransientState.backNID;
            this.nidToNavigationEvent[navigationEvent.id] = navigationEvent;
          }
          else {  // app forward navigation
            navigationEvent.trigger = 'imperative';
            navigationEvent.nvgExtras = nvgData;
            navigationEvent.appExtras = appData;
            this.nidToNavigationEvent[navigationEvent.id] = navigationEvent;
          }
          this.navigationEvent$.next(navigationEvent);
        }
      }
      else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        const routerTransientState = this.getCurrentNavigationExtras("transient");
        const navigationEvent = new NavigationEvent();
        navigationEvent.type = 'end';
        navigationEvent.uri = event.url;
        navigationEvent.id = event.id;
        navigationEvent.outlet = routerTransientState.outlet ? routerTransientState.outlet : null;
        this.navigationEvent$.next(navigationEvent);
      }
    });
  }

  getNavigationEvent(nid: number): NavigationEvent {
    return this.nidToNavigationEvent[nid];
  }

  async navigate(nvgCommand: any, outlet: string, navigationExtras?: any) {
    const transientState = new RoutingTransientState(nvgCommand, outlet, false, 0);
    this.addNavigationExtras("transient", transientState, navigationExtras);
    await this.navigate_impl(nvgCommand, outlet, navigationExtras);
  }

  async navigateBack(nvgCommand: any, outlet: string, backNID: number, navigationExtras?: any) {
    // Add transient routing state
    const transientState = new RoutingTransientState(nvgCommand, outlet, true, backNID);
    this.addNavigationExtras("transient", transientState, navigationExtras);
    await this.navigate_impl(nvgCommand, outlet, navigationExtras);

  }

  async navigate_impl(nvgCommand: any, outlet: string, navigationExtras?: any): Promise<boolean> {
    let targetUrl = nvgCommand;
    // Setup navigation options CallOptions, Id, Querystring
    let nvgExt = this.nvgOptsMngr.processNavigationOptionsExtras(nvgCommand[0], navigationExtras);
    // Resolve outlets
    [targetUrl, nvgExt] = OutletsHelper.mergeOutlets(this.activatedRoute.snapshot.url, this.activatedRoute.snapshot.queryParams, outlet, nvgCommand, nvgExt);
    targetUrl = this.normalizeRoute(targetUrl);
    // Navigate
    return this.router.navigate(targetUrl, nvgExt);
  }

  navigateByUrl(url: string, navigationExtras?: any) {
    this.router.navigateByUrl(url, navigationExtras);
  }

  getCurrentLocation(): string {
    return this.location.path();
  }

  setNavigationExtras(nvgData: any, appData: any, navigationExtras: any = {}): any {
    let navigationExtras1 = this.addNavigationExtras("nvg", nvgData, navigationExtras);
    navigationExtras1 = this.addNavigationExtras("app", appData, navigationExtras1);
    return navigationExtras1;
  }

  private getCurrentNavigationExtras(dataName: string): any {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state && currentNavigation.extras.state[dataName]) {
      return currentNavigation.extras.state[dataName];
    } else {
      return {};
    }
  }

  private addNavigationExtras(dataName: string, dataContent: any, navigationExtras: any): any {
    if (!navigationExtras) {
      navigationExtras = { state: {} };
    }
    else if (!navigationExtras.state) {
      navigationExtras.state = {};
    }
    navigationExtras.state[dataName] = dataContent;
    return navigationExtras;
  }

  private normalizeRoute(targetUri: any): any {
    const uriSegments = this.normalizeRouteCommands(targetUri);
    const prefixSegment = this.resolvePrefixSegment(uriSegments);
    return [prefixSegment].concat(uriSegments).filter(x => x !== null);
  }

  private normalizeRouteCommands(cmds: Array<any>): Array<any> {
    let newCmds = [];
    for (let cmd of cmds) {
      if (typeof cmd === "string") {
        newCmds = newCmds.concat(cmd.split('/'));   // path as string
      }
      else {
        newCmds.push(cmd);    // other parameters
      }
    }
    return newCmds;
  }

  private resolvePrefixSegment(path: Array<string>) {
    if (path.length === 0 || path[0].length === 0) {
      // No route or empty route
      return null;
    }
    let sPath = '';
    for (let segment of path) {
      if (typeof segment === 'string') {
        sPath += segment;
      }
    }
    let r: any = null;
    for (r of this.router.config) {
      if (r.path && r.path === sPath) {
        return null;
      }
    }
    return this.defaultSegment;
  }
}

class RoutingTransientState {
  isBackNavigation: boolean;
  backNID: number;
  navigationCommand: any;
  outlet: any;

  constructor(navigationCommand: any, outlet: string, isBackNavigation: boolean, backNID: number) {
    this.navigationCommand = navigationCommand;
    this.outlet = outlet;
    this.isBackNavigation = isBackNavigation;
    this.backNID = backNID;
  }
}
