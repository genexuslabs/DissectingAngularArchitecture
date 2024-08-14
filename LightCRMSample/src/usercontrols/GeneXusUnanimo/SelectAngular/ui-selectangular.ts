import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__SelectAngularElement {
  Name: string;
  Class: string;
  Height: string;
  OptionHeight: string;
  Icon: string;
  ArrowIcon: string;
  IconAutoColor: boolean;
  SelectedItem: string;
  SelectItems: any;
  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);
}

export class UIGeneXusUnanimo__SelectAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__SelectAngularElement {
  Name: string;
  Class: string;
  Height: string;
  OptionHeight: string;
  Icon: string;
  ArrowIcon: string;
  IconAutoColor: boolean;
  SelectedItem: string;
  SelectItems: any;

  constructor() {
    super();
    this.Name = "";
    this.Class = "ch-select";
    this.Height = "";
    this.OptionHeight = "";
    this.Icon = "";
    this.ArrowIcon = "";
    this.IconAutoColor = null;
    this.SelectedItem = "";
    this.SelectItems = null;
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
