import * as app_settings from "../../app.settings.json";
import { Component, OnInit, Inject, CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef, inject } from "@angular/core";
import { ConfigurationState } from "@genexus/web-standard-functions/dist/lib-esm/config/configurationState";
import { DOCUMENT, NgClass } from "@angular/common";
import { Subscription, timer } from "rxjs";
import { debounce } from "rxjs/operators";

import { AppContainer } from "app/gx/base/app-container";
import { CompositeNavigation } from "app/gx/navigation/composite-navigation";
import { UIMessage } from "app/gx/ui/controls/messages/ui-message.dt";
import { UIActionBarElement } from "app/gx/ui/model/ui-actionbar";
import { Settings } from "app/app.settings";
import { AppBarService, AppBarNavigationItem } from "app/gx/base/app-bar.service";
import { IButtonElement } from "app/gx/ui/model/ui-button";
import { NavigationStyle } from "app/gx/base/view-manager";
import { PrefersColorScheme } from "./gx/std/prefers-color-scheme";
import { TranslatePipe } from "./gx/utils/translate.pipe";
import { ClassSplitPipe } from "./gx/utils/class-split.pipe";
import { ImageToSrcsetPipe } from "./gx/utils/image-to-srcset.pipe";
import { RouterOutlet } from "@angular/router";
import { NotPipe } from "./gx/utils/not.pipe";
import { WsfSubscriptionsService } from "./gx/ui/services/wsf/wsf-subscriptions.service";
import { PopupService } from "./gx/ui/services/popup/popup.service";
import { MultiLayoutState, MultiOutletComponent } from "./gx/ui/services/multi-outlet-layout/multi-outlet.component";
import { LayoutSize, MediaQueryService, SMALL_LAYOUT, LARGE_LAYOUT } from "./gx/ui/services/media-query/media-query.service";
import { ProgressService } from "./gx/ui/services/progress/progress.service";

const ApplicationSettings = app_settings["default"];

const DEFAULT_ISLOADING_UPDATE_DELAY =
  ApplicationSettings.DEFAULT_ISLOADING_UPDATE_DELAY || 300;

@Component({
  selector: "my-app",
  templateUrl: "app.component.html",
  styleUrls: ["./styles.css"],
  standalone: true,
    imports: [
        NgClass,
        RouterOutlet,
        ImageToSrcsetPipe,
        ClassSplitPipe,
        TranslatePipe,
        NotPipe,
        MultiOutletComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {

  appBarNavigation: UIActionBarElement;
  errorStatus = null;

  currentLayoutSize: LayoutSize = "large";
    layoutState: MultiLayoutState = {
    leftVisible: false,
    rightVisible:false,
    topVisible: false,
    bottomVisible: false,
    leftComponent:null,
    rightComponent: null,
    topComponent: null,
    bottomComponent: null
  };

  topApplicationBarVisible = false;
  bottomApplicationBarVisible = false;

  prefersColorSchemeSubscription: any;

  isLoading = false;

  viewContainerRef = inject(ViewContainerRef);
  wsfSubscriptionsService = inject(WsfSubscriptionsService);
  popupService = inject(PopupService);
  mediaQueryService = inject(MediaQueryService);
  progressService = inject(ProgressService);

  constructor(
    public app: AppContainer,
    private nvg: CompositeNavigation,
    @Inject(DOCUMENT) private document: Document,
    private appBarService: AppBarService
  ) {
    this.appBarNavigation = { ...new UIActionBarElement(), ...{ navigationItems: [], actionItems: [] } };
    this.appBarNavigationSubscription = this.appBarService.navigationChange.subscribe(
      (navigation:UIActionBarElement) => {
        this.appBarNavigation = navigation;
        this.updateApplicationBarVisibility();
      }
    );
  }

  private appBarNavigationSubscription: Subscription;

  async ngOnInit() {
    this.document.documentElement.lang = "en";


    // Start w-s-f interface services
    this.wsfSubscriptionsService.start(this.viewContainerRef);

    // Start media query breakpoints service
    this.mediaQueryService.start();
    this.mediaQueryService.updateCurrentLayoutSize.subscribe(
      (update) => {
        this.updateCurrentLayoutSize(update.layoutSize, update.isCurrentLayout)
      });

    // Start progressbar service
    this.progressService.start(this.viewContainerRef);

    this.prefersColorSchemeSubscription = PrefersColorScheme.getObservable().subscribe(() => {
      this.app.refreshUIContext();
    });

    this.nvg.loadingStateChange$
      .pipe(debounce(() => timer(DEFAULT_ISLOADING_UPDATE_DELAY)))
      .subscribe((isLoading) => {
        setTimeout(() => {
          this.isLoading = isLoading;
        });
      });

    ConfigurationState.loadApplicationSettings(Settings);

    this.app.setSession();
  }

  ngOnDestroy() {
    this.appBarNavigationSubscription.unsubscribe();
    this.prefersColorSchemeSubscription.unsubscribe();
    this.mediaQueryService.end();
  }

  updateApplicationBarVisibility() {
    const { appBarNavigation } = this;

    this.topApplicationBarVisible =
      appBarNavigation.visible &&
      (appBarNavigation.caption != null && appBarNavigation.caption.length > 0) ||
      (appBarNavigation.navigationStyle === NavigationStyle.Slide ||
       appBarNavigation.navigationItems.length > 0 ||
       appBarNavigation.actionItems.length > 0);

      this.bottomApplicationBarVisible =
        appBarNavigation.visible &&
        this.currentLayoutSize === SMALL_LAYOUT &&
        appBarNavigation.navigationItems.length > 0;
  }

  /**
   * Update the `currentLayoutSize` variable with the layout size `layoutSize` if `isTheCurrentLayout == true`.
   * @param layoutSize Number of breakpoint.
   * @param isTheCurrentLayout `true` if the current the window matches the layout size.
   */
  private updateCurrentLayoutSize(layoutSize: LayoutSize, isTheCurrentLayout: boolean) {
    if (isTheCurrentLayout) {
      this.currentLayoutSize = layoutSize;
      this.updateApplicationBarVisibility();
      this.nvg.updateVerticalTargetsBreakpointMatched(layoutSize != LARGE_LAYOUT);
    }
  }

  handleToggleButtonClick() {
    this.layoutState.leftVisible = !this.layoutState.leftVisible;
  }

  handleBackButtonClick() {
    if (this.appBarNavigation.onBackButtonClick) {
      this.appBarNavigation.onBackButtonClick();
    }
  }

  handleLayoutChange( layoutState:MultiLayoutState) {
    this.layoutState = layoutState;
  }

  trackAppBarItemById(
    index: number,
    item: AppBarNavigationItem | IButtonElement
  ) {
    return item.id;
  }
}
