import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'not',
  standalone: true
})
export class NotPipe implements PipeTransform {
  
  transform(value: any, args?: any): any {
    return ! value
  }
}
