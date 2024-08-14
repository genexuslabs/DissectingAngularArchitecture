import { NavigationStyle } from "app/gx/base/view-manager";
import { IButtonElement } from "app/gx/ui/model/ui-button";

export interface IActionBarElement {
  caption: string;
  class: string;
  navigationItems: IButtonElement[];
  actionItems: IButtonElement[];
  toggleButtonLabel: string;
  visible: boolean;
  navigationStyle: NavigationStyle;
  showBackButton: boolean;
  enableHeaderRowPattern: boolean;
  headerRowPatternCssClass: string;
}

export class UIActionBarElement implements IActionBarElement {
  caption: string;
  class: string;
  navigationItems: IButtonElement[];
  actionItems: IButtonElement[];
  toggleButtonLabel: string;
  visible: boolean;
  navigationStyle: NavigationStyle;
  showBackButton: boolean;
  enableHeaderRowPattern: boolean;
  headerRowPatternCssClass: string;
  onBackButtonClick?: () => void;
}
