import { NavigationExtras, Params, NavigationEnd } from "@angular/router";

export class NavigationHelper {

  static componentInstanceId = 1;

  static newComponentInstanceId() {
    return NavigationHelper.componentInstanceId++;
  }

  static appendToQueryParams(nvgExt: NavigationExtras, key: string, value: string) {
    if (!nvgExt.queryParams) {
      const qParams = {};
      qParams[key] = value;
      nvgExt = { queryParams: qParams };
    } else {
      nvgExt.queryParams[key] = value;
    }
    return nvgExt;
  }

  static addQueryParams(nvgExt: NavigationExtras, queryParams: Params) {
    if (!queryParams) {
      return nvgExt;
    }
    if (!nvgExt) {
      nvgExt = {};
    }
    if (!nvgExt.queryParams) {
      nvgExt.queryParams = queryParams;
    } else {
      for (let qp in queryParams) {
        nvgExt.queryParams[qp] = queryParams[qp];
      }
    }
    return nvgExt;
  }

  static toUriString(uri: any): string {
    const parms = [];
    if (uri.length > 1) {
      for (let pty in uri[1]) {
        parms.push(uri[1][pty]);
      }
    }
    return this.uriFromObject(uri[0], ...parms);
  }

  static uriFromObject(objectName: string, ...parameters: any) {
    if (parameters.length > 0) {
      return (
        objectName +
        "?" +
        parameters
          .map(p => {
            return encodeURI(p);
          })
          .join(",")
      );
    }
    else {
      return objectName;
    }
  }

  static emptyParams(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  }
}
