import { Injectable } from "@angular/core";
import { publish as gxPublish } from "@genexus/web-standard-functions/dist/lib-esm/web/globalEvents";
import { OutletsHelper } from "app/gx/navigation/outlets-helper";
import { PanelNavigationState } from "app/gx/navigation/panel-navigation-state.dt";
import { NavigationHelper } from "./navigation-helper";

@Injectable({
  providedIn: "root"
})
/**
 * Outlet routing and management
 */
export class OutletsNavigation {

  appOutlets = {};
  outletStack = new OutletStack();

  /**
   * Push navigation information to outlet stack
   * @param outlet
   * @param url 
   * @param options
   */
  pushToOutlet(outlet: string, url: any, options: string, navigationState: PanelNavigationState) {
    this.restoreOutletState();
    this.outletStack.push(outlet, url, options, navigationState);
    this.persistOutletState();
  }

  /**
   * Pop navigation information to outlet stack
   * @param outlet 
   */
  popFromOutlet(outlet: string): OutletHistoryData {
    this.restoreOutletState();
    this.outletStack.pop(outlet);
    this.persistOutletState();
    const toOutlet = this.outletStack.peek(outlet);
    return toOutlet ? toOutlet : { url: [""], options: null, navigationState: null };
  }

  /**
   * Get current navigation state in the given outlet
   * @param outlet 
   */
  getNavigationState(outlet): PanelNavigationState {
    const head = this.outletStack.peek(outlet);
    return head?.navigationState;
  }

  /**
 * Get the navigation state of the next item in the havigation stack
 * @param outlet 
 */
  getPopNavigationState(outlet): PanelNavigationState {
    const head = this.outletStack.peek(outlet, 1);
    return head?.navigationState;
  }

  /**
   * Checks if there's somewhere to go back
   * @param outlet 
   */
  canGoBack(outlet: string): boolean {
    return this.outletStack.getCount(outlet) > 1;
  }

  /**
   * Messages UI to activate/show the given outlet
   * @param outlet 
   *    outlet to show
   */
  showOutlet(outlet: string) {
    gxPublish('gx-standard-api-to-generator_showTarget', '', outlet);
  }

  /**
   * Messages UI to deactivate/hide the given outlet
   * @param outlet
   *    outlet to hide 
   */
  hideOutlet(outlet: string) {
    gxPublish("gx-standard-api-to-generator_hideTarget", '', outlet);
  }

  /**
   * Shows and hide existing outlets keeping active only the given ones
   * @param outlets
   *    outlets to keep active
   */
  showOutlets(outlets: Array<string>) {
    for (const o in this.appOutlets) {
      if (outlets.indexOf(o) > -1) {
        this.showOutlet(o);
      } else {
        this.hideOutlet(o);

      }
    }
  }

  /**
   * Messages UI to load the given component dynamically
   * @param outlet
   * @param uri component URI
   * @param options options to set
   */
  private setOutlet(outlet: string, uri: string, options: string) {
    this.appOutlets[outlet] = true;
    gxPublish('gx-app-setOutlet', outlet, uri, options);
  }

  /**
   * Persists the current outlets state in the session storage
   */
  private persistOutletState() {
    const outletState = {
      current: this.outletsState,
      stack: this.outletStack.outlets
    };
    sessionStorage.setItem('outlets-state', JSON.stringify(outletState));
  }

  /**
   * Restores the current outlets state from session storage
   */
  private restoreOutletState() {
    const outletsStateStorage = sessionStorage.getItem('outlets-state');
    if (outletsStateStorage) {
      const outletsState = JSON.parse(outletsStateStorage);
      this.outletsState = outletsState?.current ?? {};
      this.outletStack.outlets = outletsState?.stack ?? new Array<OutletState>();
    }
  }

  /**
   * Outlet state management
   */
  outletsState = {};

  renderOutletsInUrl(uri, targetOutlet, isVerticalTargetsBreakpointMatched) {

    const activatedOutlets = this.loadSecondaryOutletsFromState();
    if (isVerticalTargetsBreakpointMatched) {
      // show target outlet
      if (
        targetOutlet === null &&
        !OutletsHelper.hasContentInPrimaryOutlet(uri)
      ) {
        // Targets primary outlet it has NO content -> defaults to showing all active secondary outlets
        for (const outlet of activatedOutlets) {
          this.showOutlet(outlet);
        }
      } else {
        // Show target outlet
        this.showOutlet(targetOutlet);
      }
    } else {
      // show all active outlets
      this.showOutlets(activatedOutlets);
    }

  }

  setState(outlet, cmd, options) {
    if (outlet) {
      const url = NavigationHelper.toUriString(cmd);
      this.outletsState[outlet] = { url: url, options: options };
      this.persistOutletState();
    }
  }

  /**
   * Renders to secondary outlets from outlets state
   */
  loadSecondaryOutletsFromState(): Array<string> {
    this.restoreOutletState();
    const activeOutlets = [];
    for (const o in this.outletsState) {
      this.setOutlet(o, this.outletsState[o].url, this.outletsState[o].options);
      activeOutlets.push(o);
    }

    // Clear deactivated outlets
    for (let o in this.appOutlets) {
      if (activeOutlets.indexOf(o) === -1) {
        this.setOutlet(o, null, null);
      }
    }
    return activeOutlets;
  }

}

/**
 * Implements a stack for every used outlet
 */
class OutletStack {
  outlets = new Array<OutletState>();

  push(outlet: string, url: any, options: any, navigationState: PanelNavigationState) {
    const o = this.outlets.find(x => x.name === outlet);
    if (o) {
      o.history.push({ url: url, options: options, navigationState: navigationState });
    } else {
      this.outlets.push({ name: outlet, history: [{ url: url, options: options, navigationState: navigationState }] });
    }
  }

  pop(outlet: string) {
    const o = this.outlets.find(x => x.name === outlet);
    if (o) {
      return o.history.pop();
    } else {
      return null;
    }
  }

  peek(outlet: string, skip = 0) {
    const o = this.outlets.find(x => x.name === outlet);
    if (o) {
      return this.getHead(o, skip);
    } else {
      return null;
    }
  }

  getCount(outlet: string) {
    const o = this.outlets.find(x => x.name === outlet);
    if (o) {
      return o.history.length;
    }
    return 0;
  }

  getCurrentState(): Array<{ name: string, options: string, url: string }> {
    const currentState = [];
    for (const o of this.outlets) {
      const oSt = this.getHead(o);
      if (oSt) {
        currentState.push({
          name: o.name,
          options: oSt.options,
          url: oSt.url
        });
      }
    }
    return currentState;
  }

  getHead(o: OutletState, skip = 0) {
    if (o && o.history.length > 0) {
      return o.history[o.history.length - 1 - skip];
    }
    return null;
  }

}

class OutletState {
  name: string;
  history: Array<OutletHistoryData>;
}

export class OutletHistoryData {
  url: any;
  options: string | null;
  navigationState: PanelNavigationState;
}
