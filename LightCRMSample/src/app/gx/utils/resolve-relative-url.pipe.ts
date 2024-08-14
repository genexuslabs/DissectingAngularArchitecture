import { Pipe, PipeTransform, inject } from "@angular/core";
import { AppContainer } from 'app/gx/base/app-container';

@Pipe({
  name: 'resolveRelativeUrl',
  standalone: true
})
export class ResolveRelativeUrlPipe implements PipeTransform {

  private app = inject(AppContainer);

  transform(url: string, args?: any): any {
    return this.app.resolveRelativeURL(url);
  }
}
