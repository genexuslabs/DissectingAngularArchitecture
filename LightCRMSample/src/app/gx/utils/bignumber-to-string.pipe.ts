import { Pipe, PipeTransform } from "@angular/core";
import { GxBigNumber } from "@genexus/web-standard-functions/dist/lib-esm/types/gxbignumber";

@Pipe({
  name: 'bigNumberToString',
  standalone: true
})
export class BigNumberToStringPipe implements PipeTransform {
  
  transform(value: GxBigNumber) {
    return GxBigNumber.convertBigNumberToString(value);
  }
}
