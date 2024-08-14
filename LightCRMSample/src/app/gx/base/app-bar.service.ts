import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { IButtonElement, UIButtonElement } from "app/gx/ui/model/ui-button";
import { NavigationStyle } from "./view-manager";
import { UIActionBarElement } from "../ui/model/ui-actionbar";
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';

@Injectable()
export class AppBarService {

  currNvg: UIActionBarElement = { ...new UIActionBarElement(), ...{ navigationItems: [], actionItems: [] } };

  setAppbar(appBar: UIActionBarElement) {
    const newNvg = this.currNvg;
    newNvg.navigationStyle = appBar.navigationStyle ?? this.currNvg.navigationStyle;
    newNvg.showBackButton = appBar.showBackButton ?? this.currNvg.showBackButton;
    newNvg.onBackButtonClick = appBar.onBackButtonClick ?? this.currNvg.onBackButtonClick;
    newNvg.class = appBar.class ?? this.currNvg.class;
    newNvg.visible = appBar.visible ?? this.currNvg.visible;
    newNvg.caption = appBar.caption ?? this.currNvg.caption;
    newNvg.enableHeaderRowPattern = appBar.enableHeaderRowPattern ?? this.currNvg.enableHeaderRowPattern;
    newNvg.headerRowPatternCssClass = appBar.headerRowPatternCssClass ?? this.currNvg.headerRowPatternCssClass;
    newNvg.navigationItems = appBar.navigationItems ?? this.currNvg.navigationItems;
    newNvg.actionItems = this.mapActionPriority(appBar.actionItems) ?? this.currNvg.actionItems;

    this.currNvg = newNvg;
    this.setNavigation(newNvg);
  }

  mapActionPriority(actions) {
    return actions?.map((action) => ({
      ...action,
      slotName: action?.priority ? `${action.priority.toLowerCase()}-priority-action` : 'normal-priority-action'
    }))
  }
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
  secondaryClassName?: string;
  items?: AppBarNavigationItem[];
  toggleButtonLabel?: string;
  visible?: boolean;
  navigationStyle?: NavigationStyle;
  showBackButton?: boolean;
  enableHeaderRowPattern?: boolean;
  headerRowPatternCssClass?: string;
  onBackButtonClick?: () => void;
}

export interface AppBarNavigationItem {
  id?: string;
  caption?: string;
  className?: string;
  href?: string;
  icon?: GxImage;
  onClick?: () => void;
}
