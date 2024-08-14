import {
  OnInit,
  OnChanges,
  AfterViewInit,
  Input,
  Directive,
  ChangeDetectorRef,
  inject
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, BehaviorSubject, combineLatest } from "rxjs";
import { AppContainer } from "app/gx/base/app-container";
import { ViewManager, ComponentViewDefinition } from "app/gx/base/view-manager";
import { TypeConversions } from "app/gx/base/type-conversion";
import { msg } from "@genexus/web-standard-functions/dist/lib-esm/misc/msg";
import { CompositeNavigation, CompositeNavigationSnapshot } from "app/gx/navigation/composite-navigation";
import { ComponentsStateManager, IStateContainer } from "app/gx/navigation/navigation-state";
import { ActionState } from "app/gx/base/action-state.dt";
import { OutletsHelper } from "app/gx/navigation/outlets-helper";
import { Settings } from "../../app.settings";
import { GxCollectionData } from "./gxcollection.dt";
import { GAMService } from "app/gx/auth/gam.service";
import { UriService } from "app/gx/navigation/uri.service";
import { ProgressService } from "../ui/services/progress/progress.service";
import { PanelService } from "./panel.service";
import { OutletNavigationToComponentInstance } from "app/gx/navigation/outlets-navigation-to-instance";

/**
 * Class implementing the base panel behaviour
 */
@Directive()
export class PanelComponent
  implements OnInit, OnChanges, AfterViewInit, IStateContainer {
  @Input() Mode: string;
  @Input() sectionType: string;
  @Input("HostInfo") __hostInfo = new HostInfo(null, null);

  __isDynComponent = false;
  __dynCompoParameters: any;
  __dynRefresh = false;
  __showAsCard = true;
  __canControlAppBar = false;
  __pushToNavigationStack = false;

  __dataReady$ = new BehaviorSubject<boolean>(false);
  __viewInitialized$ = new BehaviorSubject<boolean>(false);
  __layoutIsReady = false;
  __actionsEnabled = false;

  __viewManager = new ViewManager();
  __views: ComponentViewDefinition[];

  __iid: number;
  __stateMembers = [];
  __routingPath: string;

  __subscriptions = new Subscription();


  static activePanel: PanelComponent | null = null;

  panelService: PanelService;
  uriService = inject(UriService);
  progress = inject(ProgressService);

  public app = inject(AppContainer);
  protected nvg = inject(CompositeNavigation);
  protected activatedRoute = inject(ActivatedRoute);
  protected cdr = inject(ChangeDetectorRef);
  private nid2iid = inject(OutletNavigationToComponentInstance);
  private activeState = inject(ComponentsStateManager);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Panel lifecycle
  //
  //    * loadPanelWithData
  //        - when navigating to this panel
  //        - when component parameters have changed (for 'inline' panels)
  //        - when panel has been loaded as a gx-component
  //    * panelIsReady
  //        - when data loading and view initialization are done

  ngOnChanges() {
    // Component parameters have changed
    this.loadPanelWithData(null);
  }

  ngOnInit() {
    if (!this.__isDynComponent) {
      this.app.setSyncFirstHttpRequest();
    }
    if (this.sectionType !== "inline" && this.sectionType !== "master" && !this.__isDynComponent) {
      this.__subscriptions.add(
        this.activatedRoute.params.subscribe(async (params) => {
          // Route parameters have changed
          this.loadPanelWithData(params);
        })
      );
    }

    this.__subscriptions.add(
      combineLatest([this.__dataReady$, this.__viewInitialized$]).subscribe(
        async (params) => {
          // Data ready and view initialized -> Start inner components
          if (params[0] === true && params[1] === true) {
            await this.panelIsReady();
          }
        }
      )
    );

    this.__subscriptions.add(
      this.app.uiContextSubject.subscribe(() => {
        this.cdr.markForCheck();
      })
    );

    this.__subscriptions.add(this.activeState.onStateUpdated.subscribe((iid) => {
      if (this.__iid === iid) {
        this.activeState.restore(iid, this)
        this.cdr.markForCheck();
      }
    }));

    this.startEvents();
  }

  ngAfterViewInit() {
    this.__viewInitialized$.next(true);
  }

  ngOnDestroy() {
    this.__subscriptions.unsubscribe();
    if (this.__viewManager) this.__viewManager.end();
    this.endEvents();
  }

  async loadAsComponent(outlet: string, options: string, parameters: any) {
    this.__isDynComponent = true;
    this.__dynCompoParameters = parameters;
    this.__showAsCard = false;
    this.__hostInfo = new HostInfo(outlet, options);
    await this.loadPanelWithData(parameters);
  }

  async loadPanelWithData(params) {

    // Start the view manager
    this.__viewManager.start(this.__views);

    // Disable actions response during panel load 
    this.__actionsEnabled = false;
    this.__dataReady$.next(false);

    // Ensure Progress component is closed when starting a panel
    this.progress.hide();

    // Initialize panel
    this.initState();
    this.initParameters(params);
    this.initUIModel();
    await this.initPanel();
    PanelComponent.activePanel = this;

    // Start panel
    await this.startPanel(params);

    this.__actionsEnabled = true;
    this.__dataReady$.next(true);
    this.cdr.markForCheck();
  }

  tryRestoreFromState(): boolean {
    const navigationStateSnapshot = this.nvg.getNavigationSnapshot();
    if (navigationStateSnapshot.navigationTrigger === 'appback' ||
      navigationStateSnapshot.navigationTrigger === 'popstate') {
      const nid = navigationStateSnapshot.nid;
      const iid = this.nid2iid.get(nid, this.__hostInfo.outlet, this.constructor.name);
      if (this.nvg.popInstanceToRestore(iid)) {
        //Restore panel state when back-navigating or traversing browser history
        return this.activeState.restore(iid, this);
      }
    }
    return false;
  }

  async startPanel(params) {
    // Try restoring from state
    const navigationStateSnapshot = this.nvg.getNavigationSnapshot();
    const restoredFromState = this.tryRestoreFromState();

    if (!restoredFromState) {
      // Starting new panel
      this.__iid = this.activeState.newComponentInstanceId()
      await this._ClientStart();
      await this.loadPanel();
    }
    // Save new navigation state
    this.pushNavigationState(this.__iid, this.constructor.name, navigationStateSnapshot, params);
  }

  async panelIsReady() {
    // Finish pending actions
    await this.nvg.runningActionsManager.resumePendingAction(this.__iid);

    // Activate panel
    this.__dynRefresh = false;
    this.__viewManager.bindApplicationBar();
    this.initControllers();

    // Save panel navigation state
    if (!this.__iid) {
      console.log(`Panel ${this.constructor.name} has no IID!!!`)
    }
    this.activeState.save(this.__iid, this);

    this.__layoutIsReady = true;
    this.cdr.markForCheck();
  }

  pushNavigationState(iid: number, componentName: string, navigationStateSnapshot: CompositeNavigationSnapshot, params) {
    if (this.sectionType !== "master" &&
      this.sectionType !== "inline" &&
      this.isAnyOutletContent()
    ) {
      // Push new navigation to outlet stack
      this.nvg.pushNavigation(
        navigationStateSnapshot.getNavigationCommand(),
        navigationStateSnapshot.outlet,
        this.__hostInfo.options,
        navigationStateSnapshot,
        params,
        navigationStateSnapshot.stackBehavior ?? (this.__pushToNavigationStack ? "push" : null));
    }
    // Update navigation
    this.nid2iid.save(
      navigationStateSnapshot.nid,
      this.__hostInfo.outlet,
      componentName,
      iid,
    );
  }

  initParameters(params) {
    if (this.sectionType === "inline") {
      this.setParametersFromInputs();
    } else if (this.__isDynComponent) {
      this.setParameters(this.__dynCompoParameters);
    } else if (this.isAnyOutletContent()) {
      this.setParameters(params);
    } else {
      this.setParameters(null);
    }
  }

  async __Cancel() {
    const __aSt = this.startAction();
    await this.cancel(__aSt);
    this.endAction(__aSt);
  }

  private isAnyOutletContent() {
    return (
      !this.__isDynComponent ||
      OutletsHelper.isSecondaryOutlet(this.__hostInfo.outlet)
    );
  }

  isPrimaryContent() {
    return (
      this.nvg.isPrimaryOutlet() &&
      !this.__isDynComponent &&
      this.sectionType !== "master" &&
      this.sectionType !== "inline"
    );
  }

  async _ClientStart(): Promise<any> { }
  async Refresh(type?: string) { }
  initState() { }
  setParameters(params) { }
  setParametersFromInputs() { }
  initUIModel() { }
  async initPanel() { }
  async loadPanel() { }
  initControllers() { }
  startEvents() { }
  endEvents() { }


  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Navigation and state management
  //
  startAction(): ActionState {
    return this.nvg.startAction(this.__iid, this.__hostInfo.outlet);
  }

  endAction(act: ActionState) {
    this.activeState.update(act.iid, this);
    this.nvg.endAction(act);
  }

  async navigate(nvgCommand: any, act?: ActionState): Promise<any> {
    const result = await this.nvg.navigate(nvgCommand, act);
    PanelComponent.activePanel = this;
    return result;
  }

  async navigateForResult(nvgCommand: any, act?: ActionState): Promise<any> {
    return new Promise<any>(async (complete) => {
      const result = await this.nvg.navigateForResult(nvgCommand, act);
      PanelComponent.activePanel = this;
      complete(result);
    });
  }

  async navigateForResultWithExtras(
    nvgCommand: any,
    extras: any,
    act?: ActionState
  ): Promise<any> {
    return new Promise<any>(async (complete) => {
      const result = await this.nvg.navigateForResultWithExtras(
        nvgCommand,
        extras,
        act
      );
      this.activeState.restore(act.iid, this);
      PanelComponent.activePanel = this;
      complete(result);
    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Dynamic Navigation and calls
  //
  async dynamicCall(act: any, target: string, ...parameters: string[]) {
    if (target.startsWith("http://") || target.startsWith("https://")) {
      const navigationURL = this.nvg.linkToNavigationUrl(target);
      if (navigationURL) {
        await this.nvg.dynamicNavigate(act, navigationURL, ...parameters);
      } else {
        return this.nvg.link(target);
      }
    } else if (target.startsWith("sd:")) {
      await this.nvg.dynamicNavigate(act, target.substring(3), ...parameters);
    } else if (target.startsWith("prc:")) {
      const [callString, callParameters] = await this.uriService.parsePRCCall(
        target.substring(4),
        parameters
      );
      this.panelService[callString].call(this, ...callParameters);
    } else {
      console.warn(`Could not resolve how to call ${target}`);
    }
  }

  get __panelServiceState() {
    return this.panelService?.state;
  }

  set __panelServiceState(o) {
    if (this.panelService) {
      this.panelService.state = o;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // UIModel properties
  //   UImodel properties update method
  updateUIModel(uiModel: any, defaultValues: any = []) {
    for (let i = 0; i < defaultValues.length; i++) {
      PanelComponent.setProperty(
        defaultValues[i][0],
        defaultValues[i][1],
        defaultValues[i][2],
        uiModel
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Dynamic properties
  //   dynamic properties are set in the server and arrive in the main dataprovider payload
  updateGxdynprops(entity: any, uiModel: any) {
    if (entity.Gxdynprop) {
      const dynProps = JSON.parse(entity.Gxdynprop);
      for (let i = 0; i < dynProps.length; i++) {
        PanelComponent.setProperty(
          PanelComponent.toControlName(dynProps[i][0]),
          dynProps[i][1],
          dynProps[i][2],
          uiModel
        );
      }
    }
    if (entity.Gxdyncall) {
      const dynCalls = JSON.parse(entity.Gxdyncall);
      for (let i = 0; i < dynCalls.length; i++) {
        const __aSt = PanelComponent.activePanel.startAction();
        const opt = dynCalls[i].startsWith("sd:") ? dynCalls[i].substring(3) : dynCalls[i];
        this.nvg.navigateOption(opt, 'type', 'Replace');
        this.dynamicCall(__aSt, dynCalls[i]);
        PanelComponent.activePanel.endAction(__aSt);

      }
    }
  }

  static getObjectCaseInsenitivePropertyAccess(obj: any) {
    return new Proxy(obj, {
      get(target, prop) {
        if (!target[prop]) {
          const k = PanelComponent.getPropertyKeyCaseInsensitive(target, prop);
          return k ? target[k] : undefined;
        }
        return target[prop];
      },
      set(target, prop, value) {
        if (!target[prop]) {
          const k = PanelComponent.getPropertyKeyCaseInsensitive(target, prop);
          if (k) {
            target[k] = value;
            return true;
          }
        }
        target[prop] = value;
        return true;
      },
    });
  }

  static getPropertyKeyCaseInsensitive(target, prop: string | symbol) {
    const propL = typeof prop === "string" ? prop.toLowerCase() : prop;
    return Object.keys(target).find((key) => key.toLowerCase() === propL);
  }

  static setProperty(
    ctrlName: string,
    propName1: string,
    propValue: any,
    uiModel: any
  ): boolean {
    let handled = false;
    const propName = propName1[0].toLowerCase() + propName1.substring(1);
    if (uiModel[ctrlName]) {
      const ctrl = PanelComponent.getObjectCaseInsenitivePropertyAccess(
        uiModel[ctrlName]
      );
      if (ctrl) {
        ctrl[propName] = PanelComponent.convertValue(ctrl[propName], propValue);
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

  static toControlName(propControl: string): string {
    let ctrlName = propControl;
    if (ctrlName.startsWith("&")) {
      ctrlName = ctrlName.substring(1);
    }
    return (
      "ctrl" + ctrlName[0].toUpperCase() + ctrlName.substring(1).toLowerCase()
    );
  }

  static convertValue(targetValue, propValue) {
    if (
      typeof propValue === "string" &&
      (propValue.toLowerCase() === "false" ||
        propValue.toLowerCase() === "true")
    ) {
      return propValue.toLowerCase() === "true";
    } else if (Array.isArray(propValue)) {
      return GxCollectionData.fromArray(propValue);
    } else if (typeof targetValue === "number") {
      return +propValue;
    } else {
      return propValue;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Translations
  //   Translation support for text and images

  translate(key: string): string {
    return this.app.translate(key);
  }

  getImageSource(key: string): string {
    return this.app.getImage(key)?.toAttrSrc() ?? "";
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Outlet management

  get outlet(): string {
    return this.__hostInfo.outlet;
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

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Interop

  OpenInBrowser(url: string) {
    window.location.href = url;
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Composite events processing

  isCompositeExecution = false;

  processCompositeError(e: Error) {
    if (!(e as CompositeCancel)) {
      this.app.setMessage(e.toString());
    }
  }

  compositeExecution(result, isComposite = true) {
    if (isComposite && this.app.err > 0) {
      if (this.app.errMsg) {
        this.app.setMessage(this.app.errMsg);
      }
      this.progress.hide();
      throw new CompositeCancel(
        `Composite cancelled! (${this.app.err} ${this.app.errMsg})`
      );
    }
    return result;
  }

  raiseCompositeMessage(messages: any) {
    if (messages.length > 0) {
      this.app.setError(messages[0].Type);
      this.app.setMessage(messages[0].Description);
      this.progress.hide();
      throw new CompositeCancel("Composite cancelled");
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Hidecode

  validateHidecode(result: string[]): string {
    if (result.length > 1 && result[1] === "101") {
      msg(this.translate("GXM_keynfound"));
    } else {
      return result[0];
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Athentication

  public async checkAuthentication(gam: GAMService) {
    if (await gam.isLoginCallback()) {
    } else if (!gam.isLogged()) {
      if (Settings.GAM_ANONYMOUS_USER) {
        await gam.registerAnonymous();
      } else if (Settings.GAM_CLIENT_LOGIN) {
        const __aSt = this.startAction();
        gam.setLoginInitiator(window.location.href);
        await this.navigateForResult([Settings.GAM_CLIENT_LOGIN], __aSt);
        this.endAction(__aSt);
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Data instance management
  updref<T>(instance: T): T {
    return Object.assign(Object.create(instance as object), instance);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Methods used in templates

  createImageFromURL = this.app.createImageFromURL;
  createBinaryFromObject = this.app.createBinaryFromObject;
  createAudioFromObject = this.app.createAudioFromObject;
  createVideoFromObject = this.app.createVideoFromObject;
  toNumber = TypeConversions.UINumberFromString;
  bignumberFromString = TypeConversions.bigNumberFromString;
}

/**
 * Composite cancel management
 */
export class CompositeCancel extends Error { }

export class HostInfo {
  outlet: string;
  options: string;

  constructor(outlet: string, options: string) {
    this.outlet = outlet;
    this.options = options;
  }
}
