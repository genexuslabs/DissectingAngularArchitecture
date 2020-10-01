import { NavigationExtras, Params } from "@angular/router";
import { NavigationHelper } from "app/gx/navigation/navigation-helper";

export class OutletsHelper {

  static qsToOutlets(qs: string): Array<any> {
    const result = [];
    if (qs) {
      const secondaryOutlets = qs.split("//");
      for (let o of secondaryOutlets) {
        let parts = o.split(":");
        result.push({ outlet: parts[0], url: decodeURIComponent(parts[1]) });
      }
    }
    return result;
  }

  static outletsToQs(outlets: Array<any>): string {
    const result = '';
    if (outlets) {
      const qsOutlets = [];
      for (const o of outlets) {
        if (o.outlet.length > 0 && o.url && o.url.length > 0) {
          qsOutlets.push(o.outlet + ':' + encodeURIComponent(o.url));
        }
      }
      return qsOutlets.join('//');
    }
    return result;
  }

  static isSecondaryOutlet(name: string) {
    return ['left', 'right', 'top', 'bottom', 'popup'].includes(name);
  }

  static mergeOutlets(activatedUrl: any, activatedQueryParms: Params, outlet: string, oUrl: any, nvgExt: NavigationExtras): any {
    const outlet1 = OutletsHelper.isSecondaryOutlet(outlet) ? outlet : null;
    if (outlet1) {
      const url = NavigationHelper.toUriString(oUrl);
      const qsOutlets = this.qsToOutlets(activatedQueryParms['_outlets']);
      let found = false;
      for (let o of qsOutlets) {
        if (o.outlet === outlet1) {
          o.url = url;
          found = true;
        }
      }
      if (!found) {
        qsOutlets.push({ outlet: outlet1, url: url });
      }

      return [activatedUrl, NavigationHelper.addQueryParams(nvgExt, { "_outlets": this.outletsToQs(qsOutlets) })];
    } else {
      return [oUrl, NavigationHelper.addQueryParams(nvgExt, activatedQueryParms)];
    }
  }
}
