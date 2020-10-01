import { Directive, ViewContainerRef, Input, OnChanges } from '@angular/core';
import { Meta, Title } from "@angular/platform-browser";


@Directive({
  selector: '[gx-form-properties]',
})
export class FormPropertiesDirective implements OnChanges {
  constructor(
    public viewContainerRef: ViewContainerRef,
    protected _metaService: Meta,
    protected _titleService: Title,
  ) { }

  @Input('formCaption') caption: string;

  ngOnChanges() {
    if (this.caption) {
      this._titleService.setTitle(this.caption);
      this._metaService.updateTag({ name: "description", content: this.caption });

    }
  }
}