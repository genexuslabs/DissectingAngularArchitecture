import { ComponentOutletDirective } from "./component-outlet.directive";
import {
  Input,
  Component,
  ViewChild,
  OnDestroy,
  OnChanges,
  ComponentRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
  inject
} from "@angular/core";
import { PanelComponent } from "app/gx/base/panel.component";
import { UriService } from "app/gx/navigation/uri.service";

@Component({
  selector: "gx-component-host",
  templateUrl: "./component-host.component.html",
  styleUrls: ["./component-host.component.scss"],
  standalone: true,
  imports: [ComponentOutletDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentHostComponent implements OnDestroy, OnChanges {
  @Input() componentUri: string;
  @Input() id: string;
  @Input() parentOutlet: string;
  @Input() options: string;

  @ViewChild(ComponentOutletDirective, { static: false })
  componentHost: ComponentOutletDirective;
  componentRef: ComponentRef<PanelComponent>;

  lastComponentUri = null;

  private uriService = inject(UriService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnChanges() {
    const uri = this.componentUri;
    if (uri) {

      // Load component
      const [componentName, componentParameters] = await this.uriService.parseDynamicUrl(this.componentUri);
      this.componentRef = await this.uriService.loadComponent(componentName, this.componentHost.viewContainerRef)

      // Initialize component
      const panelComponent = this.componentRef.instance as PanelComponent;
      await panelComponent.loadAsComponent(this.getHostId(), this.options, {
        _gxParameterValues: componentParameters.join(","),
      });

      this.cdr.markForCheck();
    } else {
      this.componentHost?.viewContainerRef?.clear();
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  cancel = async () => {
    const panelComponent = this.componentRef.instance as PanelComponent;
    if (panelComponent) {
      await panelComponent.__Cancel();
    }
  }

  clear = async () => {
    this.componentHost.viewContainerRef.clear();
  }

  refresh = () => {
    const panelComponent = this.componentRef.instance as PanelComponent;
    if (panelComponent) {
      panelComponent.Refresh();
    }
  }

  getHostId = (): string => {
    return this.parentOutlet ? this.parentOutlet + "-" + this.id : this.id;
  }

}
