import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__SidebarAngularElement {
  Title: string;
  Class: string;
  FooterText: string;
  DistanceToTop: number;
  Collapsible: boolean;
  SidebarItems: any;
  ActiveItemId: string;
  SelectedItemTarget: string;
  isCollapsed: boolean;
  IconAutoColor: boolean;
  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);

  onGetState(eventInfo: any);
  set_GetStateAction(action: any);
}

export class UIGeneXusUnanimo__SidebarAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__SidebarAngularElement {
  Title: string;
  Class: string;
  FooterText: string;
  DistanceToTop: number;
  Collapsible: boolean;
  SidebarItems: any;
  ActiveItemId: string;
  SelectedItemTarget: string;
  isCollapsed: boolean;
  IconAutoColor: boolean;

  constructor() {
    super();
    this.Title = "";
    this.Class = "ch-sidebar";
    this.FooterText = "";
    this.DistanceToTop = null;
    this.Collapsible = true;
    this.SidebarItems = null;
    this.ActiveItemId = "";
    this.SelectedItemTarget = "";
    this.isCollapsed = null;
    this.IconAutoColor = false;
  }
  _ItemClickAction = null;

  onItemClick(eventInfo: any) {
    eventInfo.stopPropagation();
    this._ItemClickAction();
  }

  set_ItemClickAction(action: any) {
    this._ItemClickAction = action;
  }

  _GetStateAction = null;

  onGetState(eventInfo: any) {
    eventInfo.stopPropagation();
    this._GetStateAction();
  }

  set_GetStateAction(action: any) {
    this._GetStateAction = action;
  }
}
