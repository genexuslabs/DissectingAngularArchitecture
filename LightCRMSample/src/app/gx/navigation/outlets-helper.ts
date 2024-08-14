import { DefaultUrlSerializer } from "@angular/router";

export class OutletsHelper {

  static isSecondaryOutlet(name: string) {
    return ['left', 'right', 'top', 'bottom', 'popup'].includes(name);
  }

  static hasContentInPrimaryOutlet(url: string): boolean {
    const urlSerializer = new DefaultUrlSerializer();
    const pUrl = urlSerializer.parse(url);
    if (pUrl.root.hasChildren()) {
      return true;
    }
    return false;
  }

}
