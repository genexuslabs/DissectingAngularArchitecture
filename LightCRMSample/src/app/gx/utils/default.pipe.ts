import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'default'
})
export class DefaultPipe implements PipeTransform {

  constructor() { }
  
  transform(value: any, defaultValue: any): any {
    if (value !== null) {
        return value;
      } else {
        return defaultValue;
      }
  }
}
