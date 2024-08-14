import { Pipe, PipeTransform } from "@angular/core";
import { Gauge } from "@genexus/web-standard-functions/dist/lib-esm/types/gauge";

@Pipe({
  name: 'jsonToGauge',
  standalone: true
})
export class JsonToGaugePipe implements PipeTransform {
  
  transform(json: string): Gauge {
    if (json && json !== "") {
      return new Gauge(json);
    }
  }
}