import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__IconAngularElement {
  source: string;
  size: string;
  color: string;
  autoColor: boolean;
  onClick(eventInfo: any);
  set_ClickAction(action: any);
}

export class UIGeneXusUnanimo__IconAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__IconAngularElement {
  source: string;
  size: string;
  color: string;
  autoColor: boolean;

  constructor() {
    super();
    this.source = "";
    this.size = "";
    this.color = "";
    this.autoColor = false;
  }
  _ClickAction = null;

  onClick(eventInfo: any) {
    eventInfo.stopPropagation();
    this._ClickAction();
  }

  set_ClickAction(action: any) {
    this._ClickAction = action;
  }
}
