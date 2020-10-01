import { Pipe, PipeTransform } from "@angular/core";
import { AppContainer } from 'app/gx/base/app-container';

@Pipe({
    name: 'resolveRelativeUrl'
})
export class ResolveRelativeUrlPipe implements PipeTransform {
  baseUrl = this.app.getBaseUrl();

  constructor( private app: AppContainer ) { }

    
  transform(url: string, args?: any): any {
    if (!url) return "";
    let imgLowerC = url.toLowerCase();
    if (
      imgLowerC.startsWith("http://") ||
      imgLowerC.startsWith("https://") ||
      imgLowerC.startsWith("file://") ||
      imgLowerC.startsWith("data:") ||
      imgLowerC.startsWith("/" + this.baseUrl.toLocaleLowerCase())) {
      return url;
    } else {
      return this.baseUrl + url;
    }
  }
}
