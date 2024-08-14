import {
  Input,
  Component,
  ViewChild,
  OnChanges,
  ComponentRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  ViewContainerRef
} from "@angular/core";
import { PanelComponent } from "app/gx/base/panel.component";
import { UriService } from "app/gx/navigation/uri.service";

@Component({
    selector: "gx-ng-popup",
    templateUrl: "./popup.component.html",
    styleUrls: ["./popup.component.scss"],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
export class PopupComponent implements OnChanges {
  @Input() popupVisible: boolean;
  @Input() popupStyle: any;
  @Input() options: string;
  @Input() componentUri: string | null;
  
  componentRef:ComponentRef<PanelComponent>;

  @ViewChild('component', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;

  private uriService = inject(UriService);
  private cdr = inject(ChangeDetectorRef);
  
  ngOnChanges(): void {
    this.loadComponent();
  }

  loadComponent = async () => {
    if (this.componentUri) {

      // Load component
      const [componentName, componentParameters] = await this.uriService.parseDynamicUrl(this.componentUri);
      this.componentRef =await  this.uriService.loadComponent( componentName, this.viewContainerRef)

      // Initialize component
      const panelComponent = this.componentRef.instance as PanelComponent;
      await panelComponent.loadAsComponent(
        "popup", 
        this.options, {
          _gxParameterValues: componentParameters.join(","),
        });

        this.cdr.markForCheck();
    } else {
      this.viewContainerRef?.clear();
    }
  }

  close = async () => {
    const panelComponent = this.componentRef.instance as PanelComponent;
    if (panelComponent) {
      await panelComponent.__Cancel();
    }
  }

}    
