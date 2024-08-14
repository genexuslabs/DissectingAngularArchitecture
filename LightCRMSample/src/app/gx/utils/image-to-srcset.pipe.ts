import { Pipe, PipeTransform, inject } from "@angular/core";
import { AppContainer } from "../base/app-container";
import { GxImage } from "@genexus/web-standard-functions/dist/lib-esm/types/gximage";

@Pipe({
  name: 'imageToSrcset',
  standalone: true
})
export class ImageToSrcsetPipe implements PipeTransform {

  private app = inject(AppContainer);
  
  transform(image: GxImage, context: any): string {

    if (!context || !image) {
      return ""
    } else if (image.id) {
        return this.app.getImage(image.id)?.toAttrSrcset();
    } else if (image.uri) {
        return this.app.resolveRelativeURL(image.uri);
    }
  }
}