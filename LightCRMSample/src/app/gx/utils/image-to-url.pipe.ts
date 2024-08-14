import { Pipe, PipeTransform, inject } from "@angular/core";
import { GxImage } from "@genexus/web-standard-functions/dist/lib-esm/types/gximage";
import { AppContainer } from 'app/gx/base/app-container';

@Pipe({
  name: 'imageToURL',
  standalone: true
})
export class ImageToURLPipe implements PipeTransform {

  private app = inject(AppContainer);
  
  transform(image: GxImage): string {
    
    if (!image) {
      return ""
    } else {
      return this.app.imageToURL(image);
    }
  }
}
