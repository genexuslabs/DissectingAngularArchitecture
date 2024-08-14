import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__UserMenuAngularElement {
  UserPhoto: string;
  UserFullName: string;
  UserCompany: string;
  DisplayType: string;
  ExpandBehavior: string;
  ShowVerticalSeparator: boolean;
  ShowLogoutOption: boolean;
  DropdownItems: any;
  SelectedItemId: string;
  SelectedItemTarget: string;
  LogoutIcon: string;
  Open: boolean;
  onLogout(eventInfo: any);
  set_LogoutAction(action: any);

  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);
}

export class UIGeneXusUnanimo__UserMenuAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__UserMenuAngularElement {
  UserPhoto: string;
  UserFullName: string;
  UserCompany: string;
  DisplayType: string;
  ExpandBehavior: string;
  ShowVerticalSeparator: boolean;
  ShowLogoutOption: boolean;
  DropdownItems: any;
  SelectedItemId: string;
  SelectedItemTarget: string;
  LogoutIcon: string;
  Open: boolean;

  constructor() {
    super();
    this.UserPhoto = "";
    this.UserFullName = "";
    this.UserCompany = "";
    this.DisplayType = "Avatar";
    this.ExpandBehavior = "Hover";
    this.ShowVerticalSeparator = true;
    this.ShowLogoutOption = true;
    this.DropdownItems = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
    this.LogoutIcon = "";
    this.Open = null;
  }
  _LogoutAction = null;

  onLogout(eventInfo: any) {
    eventInfo.stopPropagation();
    this._LogoutAction();
  }

  set_LogoutAction(action: any) {
    this._LogoutAction = action;
  }

  _ItemClickAction = null;

  onItemClick(eventInfo: any) {
    eventInfo.stopPropagation();
    this._ItemClickAction();
  }

  set_ItemClickAction(action: any) {
    this._ItemClickAction = action;
  }
}
