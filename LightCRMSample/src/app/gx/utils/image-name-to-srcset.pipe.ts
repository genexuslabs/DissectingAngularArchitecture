import { Pipe, PipeTransform, inject } from "@angular/core";
import { AppContainer } from "../base/app-container";

@Pipe({
  name: 'imageNameToSrcset',
  standalone: true
})
export class ImageNameToSrcsetPipe implements PipeTransform {

  private app = inject(AppContainer);
  
  transform(name: string, context: any): string {

    if (!context || !name) {
      return ""
    } else {
      return this.app.getImage(name)?.toAttrSrcset();
    }
  }
}