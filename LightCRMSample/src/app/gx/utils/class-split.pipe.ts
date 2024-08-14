import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'classSplit',
  standalone: true
})
export class ClassSplitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/,/g, ' ');
  }
}
