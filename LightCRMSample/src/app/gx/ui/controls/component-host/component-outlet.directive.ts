import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[gx-component-outlet]',
  standalone: true,
})
export class ComponentOutletDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}