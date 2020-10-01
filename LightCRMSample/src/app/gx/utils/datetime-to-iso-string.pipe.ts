import { Pipe, PipeTransform } from "@angular/core";
import { TypeConversions } from "app/gx/base/type-conversion";

@Pipe({
    name: 'datetimeToISOString'
})
export class DatetimeToISOStringPipe implements PipeTransform {

  constructor() { }
  
  transform(value: any): any {
    return TypeConversions.datetimeToISOString( value);
  }
}
