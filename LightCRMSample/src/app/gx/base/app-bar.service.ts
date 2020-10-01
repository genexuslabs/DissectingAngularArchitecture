import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { IButtonElement, UIButtonElement } from "app/gx/ui/model/ui-button";
import { NavigationStyle } from "./view-manager";

@Injectable()
export class AppBarService {
  navigationChange: Subject<AppBarNavigation> = new Subject<AppBarNavigation>();

  setNavigation(data: AppBarNavigation) {
    this.navigationChange.next(data);
  }

  actionsChange: Subject<IButtonElement[]> = new Subject<IButtonElement[]>();

  private propertyChangeSubscriptions: Subscription[] = [];

  setActions(data: IButtonElement[]) {
    this.actionsChange.next(data);
    this.clearPropertyChangeSubscriptions();
    this.listenActionsPropertyChange(data);
  }

  private listenActionsPropertyChange(actions: IButtonElement[]) {
    for (const action of actions) {
      const uiButton = action as UIButtonElement;
      if (uiButton.propertyChange !== undefined) {
        const subscription = uiButton.propertyChange.subscribe(() => {
          this.actionsChange.next(actions);
        });
        this.propertyChangeSubscriptions.push(subscription);
      }
    }
  }

  private clearPropertyChangeSubscriptions() {
    for (const subscription of this.propertyChangeSubscriptions) {
      subscription.unsubscribe();
    }
    this.propertyChangeSubscriptions = [];
  }
}

export interface AppBarNavigation {
  caption?: string;
  className?: string;
  items?: AppBarNavigationItem[];
  toggleButtonLabel?: string;
  visible?: boolean;
  navigationStyle?: NavigationStyle;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

export interface AppBarNavigationItem {
  id?: string;
  caption?: string;
  className?: string;
  href?: string;
  iconSrc?: string;
  onClick?: () => void;
}
