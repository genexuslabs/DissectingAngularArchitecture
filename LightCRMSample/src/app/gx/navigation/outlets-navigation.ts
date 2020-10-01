import { Injectable } from "@angular/core";
import { DefaultUrlSerializer, UrlSegmentGroup } from "@angular/router";
import { publish as gxPublish } from "@genexus/web-standard-functions/dist/lib-esm/web/GlobalEvents";
import { OutletsHelper } from "app/gx/navigation/outlets-helper";
import { NavigationOptionsManager, OutletOptions } from "app/gx/navigation/navigation-options-manager";

@Injectable({
  providedIn: "root"
})
/**
 * Outlet routing and management
 */
export class OutletsNavigation {

  appOutlets = {};

  outletStack = new OutletStack();

  constructor(
    private nvgOptsMngr: NavigationOptionsManager,
  ) { }

  /**
   * Renders to secondary outlets using url spec (see parm url)
   * @param url 
   *        url must contain in the queryString the target outlet and the component to render in in
   *        queryParameter syntax "_outlets"=<outletName1>:<componentUrl1>//<outletName2>:<componentUrl2>//...<outletNameN>:<componentUrlN>
   *          componentUrl must be urlEncoded
   */
  loadSecondaryOutlets(url: string): Array<string> {
    const activeOutlets = [];
    const outletsToLoad = this.parseSecondaryOutlets(url);
    for (let o of outletsToLoad) {
      this.setOutlet(o.outlet, o.url, this.nvgOptsMngr.processOutletOptions(o.outlet, o.url));
      activeOutlets.push(o.outlet);
    }

    // Clear deactivated outlets
    for (let o in this.appOutlets) {
      if (activeOutlets.indexOf(o) === -1) {
        this.setOutlet(o, null, null);
      }
    }
    return activeOutlets;
  }

  hasContentInPrimaryOutlet(url: string): boolean {
    const urlSerializer = new DefaultUrlSerializer();
    const pUrl = urlSerializer.parse(url);
    if (pUrl.root.hasChildren()) {
      return true;
    }
    return false;
  }

  /**
   * Push navigation information to outlet stack
   * @param nid 
   * @param outlet 
   * @param url 
   */
  pushToOutlet(nid: number, outlet: string, url: any) {
    // Avoid duplicates
    const head = this.outletStack.peek(outlet);
    if (head && JSON.stringify(head.url) === JSON.stringify(url)) {
      return;
    }
    this.outletStack.push(outlet, url, nid);
  }

  /**
   * Pop from outlet and returns NID and url
   * @param outlet 
   */
  popFromOutlet(outlet: string): OutletHistoryData {
    this.outletStack.pop(outlet);
    const toOutlet = this.outletStack.peek(outlet);
    return toOutlet ? toOutlet : { url: [""], navigationId: 0 };
  }

  showOutlet(outlet: string) {
    gxPublish('gx-standard-api-to-generator_showTarget', '', outlet);
  }

  private setOutlet(outlet: string, uri: string, options: OutletOptions) {
    this.appOutlets[outlet] = true;
    gxPublish('gx-app-setOutlet', outlet, uri, options);
  }

  private parseSecondaryOutlets(url: string): Array<any> {
    const urlSerializer = new DefaultUrlSerializer();
    const qs = urlSerializer.parse(url).queryParams;
    if (qs['_outlets']) {
      return OutletsHelper.qsToOutlets(qs['_outlets']);
    }
    return [];
  }
}

/**
 * Implements a stack for every used outlet
 */
class OutletStack {
  outlets = new Array<OutletState>();

  push(outlet: string, url: any, navigationId: number) {
    if (navigationId) {
      const o = this.outlets.find(x => x.name === outlet);
      if (o) {
        o.history.push({ url: url, navigationId: navigationId });
      } else {
        this.outlets.push({ name: outlet, history: [{ url: url, navigationId: navigationId }] });
      }
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

  peek(outlet: string) {
    const o = this.outlets.find(x => x.name === outlet);
    if (o) {
      return this.getHead(o);
    } else {
      return null;
    }
  }

  getHead(o: OutletState) {
    if (o && o.history.length > 0) {
      return o.history[o.history.length - 1];
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
  navigationId: number;
}
