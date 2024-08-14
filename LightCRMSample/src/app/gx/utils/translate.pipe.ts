import { Pipe, PipeTransform, inject } from "@angular/core";
import { AppContainer } from "../base/app-container";

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  private app = inject(AppContainer);
  
  transform(s: string, args?: any): any {
    return this.app.translate(s);
  }
}