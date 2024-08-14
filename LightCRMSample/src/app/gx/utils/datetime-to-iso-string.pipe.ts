import { Pipe, PipeTransform } from "@angular/core";
import { Std_TypeConversions } from "@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion";

@Pipe({
  name: 'datetimeToISOString',
  standalone: true
})
export class DatetimeToISOStringPipe implements PipeTransform {

  transform(value) {
    if (Std_TypeConversions.isValidDate(value) && !Std_TypeConversions.isEmpty(value)) {
      return Std_TypeConversions.GxDatetimeToISOString(value);
    } else {
      return "";
    }
  }
}
