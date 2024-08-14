import { Injectable, ComponentRef, signal } from '@angular/core';
import { PopupComponent } from './popup.component';
import { NavigationOptionsManager, OutletOptions} from "app/gx/navigation/navigation-options-manager";
  
  @Injectable({
    providedIn: 'root',
  })
  export class PopupService {

    popupComponent:ComponentRef<PopupComponent>;

    show(viewContainerRef, componentUri:string, options:string) {
      if (this.popupComponent) {
        this.popupComponent.destroy();
      }
      this.popupComponent = viewContainerRef.createComponent(PopupComponent) as ComponentRef<any>;
      this.popupComponent.setInput( "componentUri", componentUri)
      this.popupComponent.setInput( "popupVisible", true);
      this.popupComponent.setInput( "popupStyle", this.optionsToStyle(OutletOptions.parse(options)));
      this.popupComponent.setInput( "options", options);
    }

    hide() {
      if (this.popupComponent) {
        this.popupComponent.destroy();
      }
    }

    private optionsToStyle(options) {
      if (options) {
        const popupStyle = {};
        popupStyle["width"] = "90vw";
        popupStyle["height"] = "70vh";
        if (options.size) {
          if (options.size === NavigationOptionsManager.TARGET_SIZE_SMALL_ID) {
            popupStyle["height"] = "400px";
          } else if (
            options.size === NavigationOptionsManager.TARGET_SIZE_MEDIUM_ID
          ) {
            popupStyle["height"] = "500px";
          } else if (
            options.size === NavigationOptionsManager.TARGET_SIZE_LARGE_ID
          ) {
            popupStyle["height"] = "800px";
          }
        }
        if (options.width) {
          popupStyle["width"] = options.width;
        }
        if (options.width) {
          popupStyle["height"] = options.height;
        }
        return popupStyle;
      } else {
        return undefined;
      }
    }

  }
