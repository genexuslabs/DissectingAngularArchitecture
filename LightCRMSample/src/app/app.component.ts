import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import {
  publish as gxPublish,
  subscribe as gxSubscribe,
  unSubscribe as gxUnSubscribe,
} from "@genexus/web-standard-functions/dist/lib-esm/web/GlobalEvents";
import { ConfigurationState } from "@genexus/web-standard-functions/dist/lib-esm/config/configurationState";
import { DOCUMENT } from "@angular/common";
import { Subscription, timer } from "rxjs";
import { debounce } from "rxjs/operators";

import { AppContainer } from "app/gx/base/app-container";
import { CompositeNavigation } from "app/gx/navigation/composite-navigation";
import {
  ProgressService,
  UIProgress,
} from "app/gx/ui/controls/progress/progress.service";
import { UIMessage } from "app/gx/ui/controls/messages/ui-message.dt";
import * as app_settings from "./../../app.settings.json";
import {
  NavigationOptionsManager,
  OutletOptions,
} from "app/gx/navigation/navigation-options-manager";
import {
  AppBarService,
  AppBarNavigation,
  AppBarNavigationItem,
} from "app/gx/base/app-bar.service";
import { IButtonElement } from "app/gx/ui/model/ui-button";
import { NavigationStyle } from "app/gx/base/view-manager";

const ApplicationSettings = app_settings["default"];
const DEFAULT_APPBAR_UPDATE_DELAY =
  ApplicationSettings.DEFAULT_APPBAR_UPDATE_DELAY || 300;
const DEFAULT_ISLOADING_UPDATE_DELAY =
  ApplicationSettings.DEFAULT_ISLOADING_UPDATE_DELAY || 300;

@Component({
  selector: "my-app",
  templateUrl: "app.component.html",
  styles: [":host { display: block; }"],
  styleUrls: ["./styles.css"],
})
export class AppComponent implements OnInit {
  appMessage: UIMessage;
  appProgress: UIProgress;

  msgSubscription: any;
  confirmSubscription: any;

  leftVisible = false;
  rightVisible = false;
  topVisible = false;
  bottomVisible = false;
  popupVisible = false;
  applicationBarVisible = false;
  applicationBarSingleLine = true;

  leftComponent = null;
  rightComponent = null;
  topComponent = null;
  bottomComponent = null;
  popupComponent = null;

  popupStyle = null;

  setOutletSubscription: any;
  @ViewChild("leftOutlet", { static: false }) leftOutlet;
  @ViewChild("rightOutlet", { static: false }) rightOutlet;
  @ViewChild("topOutlet", { static: false }) topOutlet;
  @ViewChild("bottomOutlet", { static: false }) bottomOutlet;
  @ViewChild("popupOutlet", { static: false }) popupOutlet;
  showTargetSubscription: any;
  hideTargetSubscription: any;

  isLoading = false;

  constructor(
    private app: AppContainer,
    private nvg: CompositeNavigation,
    private progress: ProgressService,
    @Inject(DOCUMENT) private document: Document,
    private appBarService: AppBarService
  ) {
    this.appBarNavigationSubscription = this.appBarService.navigationChange.subscribe(
      (navigation) => {
        setTimeout(() => {
          this.appBarNavigation = {
            ...this.appBarNavigation,
            ...navigation,
          };
          this.updateApplicationBarVisibility();
        });
      }
    );
    this.appBarActionsSubscription = this.appBarService.actionsChange
      .pipe(debounce(() => timer(DEFAULT_APPBAR_UPDATE_DELAY)))
      .subscribe((actions) => {
        setTimeout(() => {
          this.appBarActions = actions.map((action) => ({
            ...action,
            slotName: `${action.priority.toLowerCase()}-priority-action`,
          }));
          this.updateApplicationBarVisibility();
        });
      });
  }

  private appBarNavigationSubscription: Subscription;
  private appBarNavigation: AppBarNavigation = {
    items: [],
  };

  private appBarActionsSubscription: Subscription;
  private appBarActions: IButtonElement[] = [];

  async ngOnInit() {
    this.app.setLanguage("English");
    this.document.documentElement.lang = "en";
    this.app.initApp("lightcrm2");
    this.app.initTheme("carmineios");
    this.app.initTranslations();

    this.msgSubscription = gxSubscribe(
      "gx-standard-api-to-generator_msg",
      (id: string, msg: string, type: string) => {
        if (
          type.toLocaleLowerCase() === "nowait" ||
          type.toLocaleLowerCase() === "status"
        )
          this.appMessage = {
            id: id,
            text: msg,
            type: "message",
            onConfirm: () => {
              gxPublish("gx-standard-api-to-generator_msg_" + id + "_ok");
            },
          };
        else {
          this.appMessage = {
            id: id,
            text: msg,
            type: "error",
            onConfirm: () => {
              gxPublish("gx-standard-api-to-generator_msg_" + id + "_ok");
            },
          };
        }
      }
    );

    this.confirmSubscription = gxSubscribe(
      "gx-standard-api-to-generator_confirm",
      (id: string, msg: string) => {
        this.appMessage = {
          id: id,
          text: msg,
          type: "confirm",
          onConfirm: () => {
            gxPublish("gx-standard-api-to-generator_confirm_" + id + "_ok");
          },
          onCancel: () => {
            gxPublish("gx-standard-api-to-generator_confirm_" + id + "_cancel");
          },
        };
      }
    );

    this.showTargetSubscription = gxSubscribe(
      "gx-standard-api-to-generator_showTarget",
      (id: string, element: string) => {
        this.showOutlet(element, true);
        gxPublish("gx-standard-api-to-generator_showTarget_" + id + "_ok");
      }
    );

    this.hideTargetSubscription = gxSubscribe(
      "gx-standard-api-to-generator_hideTarget",
      (id: string, element: string) => {
        this.showOutlet(element, false);
        gxPublish("gx-standard-api-to-generator_hideTarget_" + id + "_ok");
      }
    );

    this.setOutletSubscription = gxSubscribe(
      "gx-app-setOutlet",
      (outlet: string, component: string, options: OutletOptions) => {
        this.setOutlet(outlet, component, options);
      }
    );

    this.progress.getObservable().subscribe((prog) => {
      this.appProgress = prog;
    });

    this.nvg.loadingStateChange$
      .pipe(debounce(() => timer(DEFAULT_ISLOADING_UPDATE_DELAY)))
      .subscribe((isLoading) => {
        setTimeout(() => {
          this.isLoading = isLoading;
        });
      });

    ConfigurationState.loadApplicationSettings(ApplicationSettings);

    this.app.setSession();
  }

  ngOnDestroy() {
    gxUnSubscribe(this.msgSubscription);
    gxUnSubscribe(this.confirmSubscription);
    gxUnSubscribe(this.showTargetSubscription);
    gxUnSubscribe(this.hideTargetSubscription);
    gxUnSubscribe(this.setOutletSubscription);
    this.appBarNavigationSubscription.unsubscribe();
    this.appBarActionsSubscription.unsubscribe();
  }

  onPopupClose() {
    if (this.popupVisible) {
      this.popupOutlet.cancel();
    }
  }

  showOutlet(target: string, value: boolean) {
    if (target === null) {
      // primary outlet
      if (value) {
        // hide secondaries to show it
        this.leftVisible = false;
        this.rightVisible = false;
        this.topVisible = false;
        this.bottomVisible = false;
      }
    } else {
      // secondary outlets
      target = target.toLowerCase();
      if (target === "left") {
        this.leftVisible = value;
      } else if (target === "right") {
        this.rightVisible = value;
      } else if (target === "top") {
        this.topVisible = value;
      } else if (target === "bottom") {
        this.bottomVisible = value;
      }
    }
  }

  setOutlet(target: string, component: string, options: OutletOptions = null) {
    target = target.toLowerCase();
    if (target === "left") {
      this.leftComponent = component;
      this.leftOutlet.start();
    } else if (target === "right") {
      this.rightComponent = component;
      this.rightOutlet.start();
    } else if (target === "top") {
      this.topComponent = component;
      this.topOutlet.start();
    } else if (target === "bottom") {
      this.bottomComponent = component;
      this.bottomOutlet.start();
    } else if (target === "popup") {
      if (component) {
        this.setPopupOptions(options);
        this.popupComponent = component;
        this.popupVisible = true;
        this.popupOutlet.start();
      } else {
        this.setPopupOptions(options);
        this.popupComponent = null;
        this.popupVisible = false;
      }
    }
  }

  setPopupOptions(options: OutletOptions) {
    if (options) {
      this.popupStyle = {};
      this.popupStyle["max-width"] = "90vw";
      this.popupStyle["max-height"] = "70vh";

      if (options.size) {
        if (options.size === NavigationOptionsManager.TARGET_SIZE_SMALL_ID) {
          this.popupStyle["height"] = "400px";
        } else if (
          options.size === NavigationOptionsManager.TARGET_SIZE_MEDIUM_ID
        ) {
          this.popupStyle["height"] = "500px";
        } else if (
          options.size === NavigationOptionsManager.TARGET_SIZE_LARGE_ID
        ) {
          this.popupStyle["height"] = "800px";
        }
      } else {
        this.popupStyle["min-height"] = "50vh";
      }
      if (options.width) {
        this.popupStyle["width"] = options.width;
      }
      if (options.width) {
        this.popupStyle["height"] = options.height;
      }
    }
  }

  updateApplicationBarVisibility() {
    const { appBarNavigation, appBarActions } = this;
    this.applicationBarVisible =
      appBarNavigation.visible &&
      (appBarNavigation.navigationStyle === NavigationStyle.Slide ||
        appBarNavigation.items.length > 0 ||
        appBarActions.length > 0);
  }

  handleToggleButtonClick() {
    this.leftVisible = !this.leftVisible;
  }

  handleBackButtonClick() {
    if (this.appBarNavigation.onBackButtonClick) {
      this.appBarNavigation.onBackButtonClick();
    }
  }

  handleLeftTargetHiddenChange(event: CustomEvent) {
    this.leftVisible = !event.detail;
  }

  handleRightTargetHiddenChange(event: CustomEvent) {
    this.rightVisible = !event.detail;
  }

  handleTargetsBreakpointMatchCange(event: CustomEvent) {
    this.nvg.updateVerticalTargetsBreakpointMatched(event.detail.matches);
  }

  trackAppBarItemById(
    index: number,
    item: AppBarNavigationItem | IButtonElement
  ) {
    return item.id;
  }
}
