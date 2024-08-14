import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__StepAngularElement {
  Class: string;
  StepItems: any;
  SelectedItem: string;
  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);
}

export class UIGeneXusUnanimo__StepAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__StepAngularElement {
  Class: string;
  StepItems: any;
  SelectedItem: string;

  constructor() {
    super();
    this.Class = "ch-step";
    this.StepItems = null;
    this.SelectedItem = "";
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
