import { Pipe, PipeTransform } from "@angular/core";
import { AppContainer } from "../base/app-container";

@Pipe({
    name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor( private app: AppContainer ) { }
  
  transform(s: string, args?: any): any {
    return this.app.translate(s);
  }
}