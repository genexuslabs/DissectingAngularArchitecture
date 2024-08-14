import { Pipe, PipeTransform } from "@angular/core";
import { Std_TypeConversions } from "@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion";

@Pipe({
  name: 'timeToISOString',
  standalone: true
})
export class TimeToISOStringPipe implements PipeTransform {

  transform(value: any): any {
    if (Std_TypeConversions.isValidDate(value)) {
      return Std_TypeConversions.timeToISOString(value);
    } else {
      return "";
    }
  }
}
