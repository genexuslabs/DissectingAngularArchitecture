import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__TreeviewAngularElement {
  ToggleCheckboxes: boolean;
  SingleSelection: boolean;
  TreeviewItems: any;
  TreeviewItemsCurrentIndex: number;
  SelectedItemId: string;
  SelectedItemTarget: string;
  onItemClick(eventInfo: any);
  set_ItemClickAction(action: any);
}

export class UIGeneXusUnanimo__TreeviewAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__TreeviewAngularElement {
  ToggleCheckboxes: boolean;
  SingleSelection: boolean;
  TreeviewItems: any;
  TreeviewItemsCurrentIndex: number;
  SelectedItemId: string;
  SelectedItemTarget: string;

  constructor() {
    super();
    this.ToggleCheckboxes = null;
    this.SingleSelection = false;
    this.TreeviewItems = null;
    this.TreeviewItemsCurrentIndex = null;
    this.SelectedItemId = "";
    this.SelectedItemTarget = "";
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
