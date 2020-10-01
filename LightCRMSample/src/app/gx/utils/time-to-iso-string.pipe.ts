import { Pipe, PipeTransform } from "@angular/core";
import { TypeConversions } from "app/gx/base/type-conversion";

@Pipe({
    name: 'timeToISOString'
})
export class TimeToISOStringPipe implements PipeTransform {

  constructor() { }
  
  transform(value: any): any {
    return TypeConversions.timeToISOString( value);
  }
}
