import { Pipe, PipeTransform, inject } from "@angular/core";
import { GxBinary } from "@genexus/web-standard-functions/dist/lib-esm/types/gxbinary";
import { AppContainer } from 'app/gx/base/app-container';

@Pipe({
  name: 'binaryToURL',
  standalone: true
})
export class BinaryToURLPipe implements PipeTransform {

  private app = inject(AppContainer);

  transform(image: GxBinary, context: any): any {
    return this.app.binaryToURL(image);
  }
}
