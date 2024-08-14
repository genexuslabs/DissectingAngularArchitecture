import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'default',
  standalone: true
})
export class DefaultPipe implements PipeTransform {

  transform(value: any, defaultValue: any): any {
    if (value !== null && value !== undefined) {
      return value;
    } else {
      return defaultValue;
    }
  }
}
