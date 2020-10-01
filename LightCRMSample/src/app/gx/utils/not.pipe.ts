import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'not'
})
export class NotPipe implements PipeTransform {

  constructor() { }
  
  transform(value: any, args?: any): any {
    return ! value
  }
}
