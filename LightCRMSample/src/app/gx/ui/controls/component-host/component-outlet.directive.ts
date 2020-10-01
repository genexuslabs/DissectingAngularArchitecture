import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[gx-component-outlet]',
})
export class ComponentOutletDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}