import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__DropdownAngularElement {
  UserPhoto: string;
  UserFullName: string;
  UserCompany: string;
  DisplayType: string;
  DropdownItems: any;
  SelectedItemId: string;
  SelectedItemTarget: string;
  onLogout(eventInfo: any);
  set_LogoutAction(action: any);

  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);
}

export class UIGeneXusUnanimo__DropdownAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__DropdownAngularElement {
  UserPhoto: string;
  UserFullName: string;
  UserCompany: string;
  DisplayType: string;
  DropdownItems: any;
  SelectedItemId: string;
  SelectedItemTarget: string;

  constructor() {
    super();
    this.UserPhoto = "";
    this.UserFullName = "";
    this.UserCompany = "";
    this.DisplayType = "Avatar";
    this.DropdownItems = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
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
