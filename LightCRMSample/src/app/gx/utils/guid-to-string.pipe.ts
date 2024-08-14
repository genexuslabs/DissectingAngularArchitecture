import { Pipe, PipeTransform } from "@angular/core";
import { GxGuid } from "@genexus/web-standard-functions/dist/lib-esm/types/gxguid";

@Pipe({
  name: 'guidToString',
  standalone: true
})
export class GuidToStringPipe implements PipeTransform {

  transform(guid: GxGuid): any {
    return guid.toString()
  }
}