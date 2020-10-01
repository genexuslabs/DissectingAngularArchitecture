import {
  OnInit,
  OnChanges,
  AfterViewInit,
  Input,
  ViewChildren,
  QueryList,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
import { AppContainer } from "app/gx/base/app-container";
import { ViewManager, ComponentViewDefinition } from "app/gx/base/view-manager";
import { TypeConversions } from "app/gx/base/type-conversion";
import { UIListElementItem } from "app/gx//ui/model/ui-list";
import { ComponentHostComponent } from "app/gx/ui/controls/component-host/component-host.component";
import { msg } from "@genexus/web-standard-functions/dist/lib-esm/misc/msg";
import { CompositeNavigation } from "app/gx/navigation/composite-navigation";
import { IStateContainer } from "app/gx/navigation/navigation-state";
import { PanelNavigationState } from "app/gx/navigation/panel-navigation-state.dt";
import { NavigationHelper } from "app/gx/navigation/navigation-helper";
import { ActionState } from "app/gx/base/action-state.dt";
import { OutletsHelper } from "app/gx/navigation/outlets-helper";

/**
 * Class implementing the base panel behaviour
 */
export class PanelComponent
  implements OnInit, OnChanges, AfterViewInit, IStateContainer {
  @Input() Mode: string;
  @Input() sectionType: string;

  private _isDynComponent = false;
  private _dynCompoParameters: any;
  private _dynRefresh = false;
  showAsCard = true;
  canControlAppBar = false;

  _dataReady$ = new BehaviorSubject<boolean>(false);
  _viewInitialized$ = new BehaviorSubject<boolean>(false);

  viewManager = new ViewManager();
  views: ComponentViewDefinition[];

  _actionsEnabled = false;

  stateMembers = [];
  _navigation = new PanelNavigationState();
  _outlet: string = null;
  _routingPath: string;

  private _subscriptions = new Subscription();

  static nextRuntimeActionId = 1;

  @ViewChildren(ComponentHostComponent) childComponents: QueryList<
    ComponentHostComponent
  >;
  componentsController = new ComponentsController();

  constructor(
    public app: AppContainer,
    protected nvg: CompositeNavigation,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._actionsEnabled = false;
    this._subscriptions.add(
      this.activatedRoute.params.subscribe(async (params) => {
        // Route parameters have changed
        this._actionsEnabled = false;
        let stateFound = false;
        if (this.nvg.restoringComponent()) {
          if (!this._dynRefresh) {
            // Restoring component: returning from call
            const nid = this.nvg.getRestoringNID();
            this.nvg.restoreState(
              this.constructor.name,
              this._outlet,
              nid,
              this
            );
            stateFound = true;
          }
        } else {
          // Navigation state
          this._navigation = new PanelNavigationState();
          this._navigation.iid = NavigationHelper.newComponentInstanceId();
          this._navigation.fromAction = this.nvg.getRunningAction();
          this._navigation.outlet = this._outlet;
          this._navigation.nid = this.nvg.getNavigationId();
          this._navigation.navigationCommand = this.nvg.getNavigationCommand();

          if (this.isOutletContent() && this.sectionType !== "inline") {
            // Push new navigation to outlet stack
            const nvgCommand: Array<any> = [this._routingPath];
            if (!NavigationHelper.emptyParams(params)) {
              nvgCommand.push(params);
            }
            this.nvg.pushToOutlet(
              this.nvg.getNavigationId(),
              this._outlet,
              nvgCommand
            );
            this.initState(this._isDynComponent ? this._dynCompoParameters : params);
          } else {
            this.initState(null);
          }

          this.initPanel();
          await this._ClientStart();
        }

        this._dynRefresh = false;
        if (!stateFound) {
          // no state found -> must be loaded
          await this.loadPanel();
        }
        this._actionsEnabled = true;
        // When component state is ready -> init controllers and add new component to active state
        this.initControllers();
        this.nvg.saveState(
          this.constructor.name,
          this._outlet,
          this.nvg.getNavigationId(),
          this
        );
        this._dataReady$.next(true);
      })
    );

    this._subscriptions.add(
      combineLatest(this._dataReady$, this._viewInitialized$).subscribe(
        (params) => {
          // Data ready and view initialized -> Start inner components
          if (params[0] === true && params[1] === true) {
            this.componentsController.start(this.childComponents);
            this._dataReady$.complete();
            this._viewInitialized$.complete();
          }
        }
      )
    );
    this.startEvents();
    this.viewManager.start(this.views);
  }

  ngAfterViewInit() {
    this._viewInitialized$.next(true);
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
    if (this.viewManager) this.viewManager.end();
    if (this.componentsController) this.componentsController.end();
    this.endEvents();
  }

  async _ClientStart(): Promise<any> {}
  async Refresh(type?: string) {} // TODO: Support type='keep'
  initState(params) {
    this.loadParams(params);
  }
  loadParams(params) { }
  initPanel() { }
  async loadPanel() {}
  initControllers() {}
  startEvents() {}
  endEvents() {}

  async __Cancel() {
    const __aSt = this.startAction();
    await this.cancel(__aSt);
    this.endAction(__aSt);
  }

  private isOutletContent() {
    return (
      !this._isDynComponent || OutletsHelper.isSecondaryOutlet(this._outlet)
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Panel loaded as dynamic component
  //
  initDynComponent(outlet: string, parameters: any) {
    this._isDynComponent = true;
    this._dynCompoParameters = parameters;
    this.showAsCard = false;
    this._outlet = outlet;
  }

  refreshDynComponent(outlet: string, parameters: any) {
    this.initDynComponent(outlet, parameters);
    this._dynRefresh = true;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Events processing
  //
  callAction = async (actionMethod: any, ...parms) => {
    await actionMethod.bind(this)(...parms);
  };

  startAction(): ActionState {
    const act = new ActionState();
    act.iid = this._navigation.iid;
    act.navigationState = this._navigation;
    act.actionId = PanelComponent.nextRuntimeActionId++;
    return act;
  }

  endAction(act: ActionState) {
    this.nvg.endAction(act);
  }

  getRunningAction(outlet: string) {}
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Dynamic properties
  //   dynamic properties are set in the server and arrive in the main dataprovider payload

  updateGxdynprops(entity: any, uiModel: any) {
    if (entity.Gxdynprop) {
      const dynProps = JSON.parse(entity.Gxdynprop);
      for (let i = 0; i < dynProps.length; i++) {
        this.setProperty(dynProps[i], uiModel);
      }
    }
    if (entity.Gxdyncall) {
      const dynCalls = JSON.parse(entity.Gxdyncall);
      for (let i = 0; i < dynCalls.length; i++) {
        this.nvg.dynamicCall(null, dynCalls[i]);
      }
    }
  }

  setGridControlProperty(
    propToApply: any,
    uiModel: UIListElementItem
  ): boolean {
    let handled = true;
    const propName = propToApply[1].toLowerCase();
    switch (propName) {
      case "itemlayout":
        uiModel.Itemlayout = propToApply[2];
        break;
      default:
        handled = this.setProperty(propToApply, uiModel);
    }
    return handled;
  }

  setProperty(propToApply: any, uiModel: any): boolean {
    let handled = false;
    const ctrlName = this.toControlName(propToApply[0]);
    const propName =
      propToApply[1][0].toLowerCase() + propToApply[1].substring(1);
    if (uiModel[ctrlName]) {
      const propValue = propToApply[2];
      if (
        typeof propValue === "string" &&
        (propValue.toLowerCase() === "false" ||
          propValue.toLowerCase() === "true")
      ) {
        uiModel[ctrlName][propName] = propValue.toLowerCase() === "true";
      } else {
        uiModel[ctrlName][propName] = propValue;
      }
      handled = true;
    }

    if (!handled) {
      console.log(
        `Could not setProperty Control property: '${ctrlName}.${propName}'`
      );
    }
    return handled;
  }

  toControlName(propControl: string): string {
    let ctrlName = propControl;
    if (ctrlName.startsWith("&")) {
      ctrlName = ctrlName.substring(1);
    }
    return (
      "ctrl" + ctrlName[0].toUpperCase() + ctrlName.substring(1).toLowerCase()
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Translations
  //   Translation support for text and images

  translate(key: string) {
    return this.app.translate(key);
  }

  getImageSource(key: string) {
    return this.app.getImageSource(key);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Outlet management

  get outlet(): string {
    return this._outlet;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // SD Actions

  async return(result: any, act: any) {
    await this.nvg.back(act, result);
  }

  async cancel(act: any) {
    await this.nvg.back(act);
  }

  returnTo(url: string, act: any): void {
    this.nvg.backTo(url, act);
  }

  cancelTo(url: string, act: any): void {
    this.nvg.backTo(url, act);
  }

  goHome(act: any): void {
    this.nvg.goHome(act);
  }

  ngOnChanges() {
    this.viewManager.setMode(this.Mode);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Interop

  OpenInBrowser(url: string) {
    window.location.href = url;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Composite events processing

  processCompositeError(e: Error) {
    console.error(e);
    if (!(e as CompositeCancel)) {
      this.app.setMessage(e.toString());
    }
  }

  abortIfFalse(value: boolean) {
    if (!value) {
      throw new CompositeCancel("Composite cancelled");
    }
  }

  validateHidecode(result: string[]): string {
    if (result.length > 1 && result[1] === "101") {
      msg(this.translate("GXM_keynfound"));
    } else {
      return result[0];
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Methods used in templates

  dateToISOString = TypeConversions.dateToISOString;
  timeToISOString = TypeConversions.timeToISOString;
  datetimeToISOString = TypeConversions.datetimeToISOString;
  dateFromISOString = TypeConversions.datetimeFromISOString;
}

/**
 * Composite cancel management
 */
export class CompositeCancel extends Error {}

/**
 * Panel GX components controller
 */
export class ComponentsController {
  state: any;
  components: QueryList<ComponentHostComponent>;

  _subscriptions = new Subscription();

  setState(s: any) {
    this.state = s;
  }

  start(c: QueryList<ComponentHostComponent>) {
    this.components = c;
    this.components.setDirty();
    this._subscriptions = this.components.changes.subscribe(
      (comps: QueryList<ComponentHostComponent>) => {
        // DOM changed
        if (this.state !== undefined) {
          comps.forEach((comp) => {
            comp.start(this.state);
          });
        }
      }
    );
  }

  end() {
    this._subscriptions.unsubscribe();
  }

  refresh(componentId: string, data: any) {
    if (this.components) {
      // Started
      this.components.forEach((comp) => {
        if (comp.id === componentId) {
          comp.refresh(data);
          return;
        }
      });
    }
  }
}
