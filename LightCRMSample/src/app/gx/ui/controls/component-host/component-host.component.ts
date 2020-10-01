import { ComponentOutletDirective } from "./component-outlet.directive";
import { Input, Component, ViewChild, OnInit, OnDestroy, OnChanges, ComponentRef, ElementRef } from "@angular/core";

import { PanelComponent } from "app/gx/base/panel.component";
import { CompositeNavigation } from "app/gx/navigation/composite-navigation";
import { VisibilityService } from "app/gx/base/visibility.service";
import { Settings } from "app/app.settings";
import { LazyLoaderService } from 'app/gx/base/lazy-loader.service';
import { Subscription, combineLatest, BehaviorSubject, of } from "rxjs";
import { UIComponentElement } from 'app/gx/ui/model/ui-component';

@Component({
  selector: "gx-component-host",
  templateUrl: "./component-host.component.html",
  styles: [
    ":host, :host > div { display: flex; flex: 1; flex-direction: column; }"
  ]
})
export class ComponentHostComponent implements OnInit, OnDestroy, OnChanges {
  @Input() componentUri: string;
  @Input() id: string;
  @Input() parentOutlet: string;

  @ViewChild(ComponentOutletDirective, { static: true }) componentHost: ComponentOutletDirective;
  componentRef: ComponentRef<PanelComponent>;

  private subscription: Subscription = new Subscription();

  lastComponentUri = null;
  private lastVersion = 0;
  private started = false;

  private started$ = new BehaviorSubject<boolean>(false);
  private uri$ = new BehaviorSubject<string>(null);
  private version$ = new BehaviorSubject<number>(0);

  constructor(
    private nvg: CompositeNavigation,
    private visibilityService: VisibilityService,
    private host: ElementRef,
    private loader: LazyLoaderService
  ) { }


  async ngOnInit() {
    let visible$ = null;
    if (Settings.loadComponentsWhenOnSight) {
      visible$ = this.visibilityService.elementInSight(this.host);
    } else {
      visible$ = of(true);
    }

    const componentChanged$ = combineLatest(
      visible$,
      this.uri$,
      this.started$,
      this.version$);

    this.subscription.add(componentChanged$.subscribe(async (status) => {
      const visible = status[0];
      const uri = status[1];
      this.started = status[2];
      const version = status[3];
      if (this.started && visible && (this.lastVersion !== version || this.lastComponentUri !== uri)) {
        await this.loadComponent(uri, version);
        this.lastComponentUri = uri;
        this.lastVersion = version;
      }
    }));

  }

  ngOnChanges() {
    this.uri$.next(this.componentUri);
  }

  start(dataContext: any = null, uiContext: UIComponentElement = null) {
    if (!this.started) {
      let uri = this.componentUri;
      if (uiContext && uiContext.object) {
        uri = uiContext.object;
      }
      if (dataContext) {
        uri = this.buildWithContext(dataContext, uri);
      }
      this.uri$.next(uri);
      this.started$.next(true);
    }
  }

  async refresh(context: any = null) {
    if (this.started) {
      let uri = this.componentUri;
      if (context) {
        uri = this.buildWithContext(context, this.componentUri);
      }
      this.uri$.next(uri);
      this.version$.next(this.lastVersion + 1);
    }
  }

  buildWithContext(context: any, uri: string) {
    if (uri) {
      const startParmsPos = uri.indexOf("?");
      if (startParmsPos >= 0) {
        const parms = [];
        for (let p of uri.substr(startParmsPos + 1).split(",")) {
          if (p.startsWith("&")) {
            p = p.substr(1);
          }
          if (context[p] !== undefined) {
            parms.push(context[p]);
          } else {
            parms.push(p);
          }
        }
        return uri.substr(0, startParmsPos) + "?" + parms.join(",");
      }
    }
    return uri;
  }

  async loadComponent(uri, version) {
    if (uri) {
      const compToCall = await this.nvg.parseDyncall(uri);
      if (compToCall) {
        const componentFactory = await this.loader.findComponentFactory(compToCall[0]);
        const viewContainerRef = this.componentHost.viewContainerRef;

        viewContainerRef.clear();
        this.componentRef = viewContainerRef.createComponent(componentFactory) as ComponentRef<PanelComponent>;

        if (compToCall.length > 1) {
          const panelComponent = this.componentRef.instance as PanelComponent;
          if (version === this.lastVersion) {
            panelComponent.initDynComponent(this.getHostId(), { _gxParameterValues: compToCall[1] });
          }
          else {
            panelComponent.refreshDynComponent(this.getHostId(), { _gxParameterValues: compToCall[1] });
          }
        }
      }
    }
    else {
      this.componentHost.viewContainerRef.clear();
    }
  }

  async cancel() {
    const panelComponent = this.componentRef.instance as PanelComponent;
    if (panelComponent) {
      await panelComponent.__Cancel();
    }
  }
  getHostId(): string {
    return this.parentOutlet ? this.parentOutlet + "-" + this.id : this.id;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.subscription.unsubscribe();
  }
}
