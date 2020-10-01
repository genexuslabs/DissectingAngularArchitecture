import { Directive, Input, ElementRef, TemplateRef, ViewContainerRef } from "@angular/core";
import { take, filter } from "rxjs/operators";
import { VisibilityService } from "./visibility.service";


@Directive({ selector: '[visibleWith]'})
export class VisibleWith {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private visibilityService: VisibilityService) { }

  @Input()
  set visibleWith(element) {
    this.visibilityService
        .elementInSight(new ElementRef(element))
        .pipe(filter(visible => visible), take(1))
        .subscribe(() => {
          this.viewContainer.createEmbeddedView(this.templateRef);    
        }); 
  }

}