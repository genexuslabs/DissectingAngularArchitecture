import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, EventEmitter, Output, ViewContainerRef, inject, OnInit} from "@angular/core";
import { LayoutSize } from "@genexus/web-controls-library/dist/types/components/common/interfaces";
import {
  publish as gxPublish,
  subscribe as gxSubscribe,
  unSubscribe as gxUnSubscribe,
} from "@genexus/web-standard-functions/dist/lib-esm/web/globalEvents";
import { PopupService } from "../popup/popup.service";
import { NgClass } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { ComponentHostComponent } from "../../controls/component-host/component-host.component";

@Component({
    selector: "gx-ng-multi-outlet",
    templateUrl: "./multi-outlet.component.html",
    styleUrls: ["./multi-outlet.component.scss"],
    standalone: true,
    imports: [
      NgClass,
      RouterOutlet,
      ComponentHostComponent,
      MultiOutletComponent
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MultiOutletComponent implements OnInit {

  @Input() topNavbarVisible = false;
  @Input() bottomNavbarVisible = false;
  @Input() layoutSize: LayoutSize = "large";
  @Input() enableHeaderRowPattern = true;
  @Input() isLoading = false;
  @Output() layoutChange: EventEmitter<MultiLayoutState> = new EventEmitter();

  layoutState: MultiLayoutState = {
    leftVisible:false,
    rightVisible:false,
    topVisible: false,
    bottomVisible: false,
    leftComponent: null,
    rightComponent: null,
    topComponent: null,
    bottomComponent: null
  }
  
  setOutletSubscription: any;
  showTargetSubscription: any;
  hideTargetSubscription: any;
  

  viewContainerRef = inject(ViewContainerRef);
  popupService = inject(PopupService);

  ngOnInit() {
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
      (outlet: string, component: string, options: string) => {
        this.setOutlet(outlet, component, options);
      }
    );
  }    

  showOutlet(target: string, value: boolean) {
    if (target === null) {
      // primary outlet
      if (value) {
        // hide secondaries to show it
        this.layoutState.leftVisible = false;
        this.layoutState.rightVisible = false;
        this.layoutState.topVisible = false;
        this.layoutState.bottomVisible = false;
        this.layoutChange.emit(this.layoutState);
      }
    } else {
      // secondary outlets
      target = target.toLowerCase();
      if (target === "left") {
        this.layoutState.leftVisible = value;
      } else if (target === "right") {
        this.layoutState.rightVisible = value;
      } else if (target === "top") {
        this.layoutState.topVisible = value;
      } else if (target === "bottom") {
        this.layoutState.bottomVisible = value;
      }
      this.layoutChange.emit(this.layoutState);
    }
  }

  setOutlet(target: string, component: string, options: string) {
    target = target.toLowerCase();
    if (target === "left") {
      this.layoutState.leftComponent = component;
    } else if (target === "right") {
      this.layoutState.rightComponent = component;
    } else if (target === "top") {
      this.layoutState.topComponent = component;
    } else if (target === "bottom") {
      this.layoutState.bottomComponent = component;
    } else if (target === "popup") {
      if (component) {
        this.popupService.show(this.viewContainerRef, component, options);
      } else {
        this.popupService.hide();
      }
    }
    this.layoutChange.emit(this.layoutState);
  }

  handleLeftTargetHiddenChange(event: CustomEvent) {
    this.layoutState.leftVisible = !event.detail;
  }

  handleRightTargetHiddenChange(event: CustomEvent) {
    this.layoutState.rightVisible = !event.detail;
  }

  ngOnDestroy() {
    gxUnSubscribe(this.showTargetSubscription);
    gxUnSubscribe(this.hideTargetSubscription);
    gxUnSubscribe(this.setOutletSubscription);
  }

}

export class MultiLayoutState {
  leftVisible: boolean;
  rightVisible: boolean;
  topVisible: boolean;
  bottomVisible: boolean;
  leftComponent: any;
  rightComponent:any;
  topComponent:any;
  bottomComponent:any;
}