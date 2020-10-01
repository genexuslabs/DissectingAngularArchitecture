import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
}) export class UriCacheService {

  srcMap = {};

  getImage(uri: string): string {
    if (uri) {
      const uploadKeyPos = uri.indexOf('gxupload:');
      if (uploadKeyPos > -1) {
        const uploadKey = uri.substr(uploadKeyPos);
        if (this.srcMap[uploadKey]) {
          return this.srcMap[uploadKey];
        }
      }
    }
    return uri;
  }

  storeImage(key: string, url: string) {
    this.srcMap[key] = url;
  }
}
