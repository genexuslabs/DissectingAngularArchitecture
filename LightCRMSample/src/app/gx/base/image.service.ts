import { Injectable } from "@angular/core";
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';

@Injectable({
  providedIn: "root"
})
export class ImageService {
  private static readonly URL_REGEX = /url\((["']?)([^\)]*)\)(?:\s+([\d.]+)x)?/i;
  private computedStyle: CSSStyleDeclaration;

  constructor() {
    this.loadComputedStyle();
  }

  refresh() {
    this.loadComputedStyle();
  }

  getImage(name: string): GxImage | null {
    let value = this.computedStyle.getPropertyValue(`--gx-image_${name}`);

    if (value) {
      let matches: RegExpMatchArray;
      let gximage = new GxImage(name);

      while (matches = value.match(ImageService.URL_REGEX)) {

        gximage.densitySet.push({
          uri: this.normalizeUri(matches[1] ? matches[2].slice(0, -1) : matches[2]),
          density: matches[3] ? parseFloat(matches[3]) : 1
        });

        value = value.slice(matches[0].length);
      }

      if (gximage.densitySet.length > 0) {
        gximage.uri = gximage.densitySet.reduce((previousValue, currentValue) => {
          return previousValue.density == 1 || previousValue.density < currentValue.density ? previousValue : currentValue;
        }).uri;
      }

      return gximage;
    }
    return null;
  }

  private normalizeUri(uri: string): string {

    if (uri.startsWith("data:image/svg+xml;utf8,")) {
      uri = `data:image/svg+xml;base64,${btoa(uri.slice(24).replace(/\\"/g, '"'))}`;
    }

    uri = uri.replace(/\\/g, '');
    uri = uri.replace(/\s/g, '%20');

    return uri;
  }

  private loadComputedStyle() {
    this.computedStyle = window.getComputedStyle(document.documentElement);
  }
}
