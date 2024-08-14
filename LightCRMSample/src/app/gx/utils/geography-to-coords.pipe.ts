import { Pipe, PipeTransform } from "@angular/core";
import { Geography } from "@genexus/web-standard-functions/dist/lib-esm/types/geography";

@Pipe({
  name: "geographyToCoords",
  standalone: true
})
export class GeographyToCoordsPipe implements PipeTransform {

  transform(geography: Geography): any {
    return `${geography.latitude},${geography.longitude}`;
  }
}
